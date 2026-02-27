export interface CalendarEvent {
    id: string;
    title: string;
    description: string;
    start: string;
    end: string;
    videoLink: string | null;
    pdfLink: string | null;
    meetLink: string | null;
    professorId: string | null;
    professorName: string | null;
    sessionType: string | null;
    type: "past" | "future";
    location?: string;
    tags: string[];
    extraVideos: { url: string; type: 'class' | 'preview' }[];
    videoType?: 'class' | 'preview';
}

function extractTags(description: string): string[] {
    if (!description) return [];
    const hashtagRegex = /#(\w+)/g;
    const matches = description.match(hashtagRegex);
    return matches ? matches.map(tag => tag.substring(1)) : [];
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY;
const CALENDAR_ID = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;

function cleanText(text: string): string {
    if (!text) return "";
    return text
        .replace(/<[^>]*>?/gm, ' ')      // Remove all HTML-like tags
        .split('&nbsp;').join(' ')       // Replace &nbsp;
        .split('&quot;').join('"')       // Replace &quot;
        .split('&lt;').join('<')         // Decode entity
        .split('&gt;').join('>')         // Decode entity
        .split('&amp;').join('&')        // Decode entity
        .replace(/\s+/g, ' ')            // Collapse multiple spaces
        .trim();
}

function extractLinks(cleanDescription: string, title?: string, sessionType?: string | null, eventId?: string, attachments: any[] = []): { video: string | null, pdf: string | null, meet: string | null, extraVideos: { url: string; type: 'class' | 'preview' }[], videoType?: 'class' | 'preview' } {
    // Manual overrides for specific problematic events
    const forceVideoIds: string[] = [
        // '_8d9lcgrfdpr6asjk71j32cpnc5i32c1p71h36e32clj66eb56koj0chp6tijadb56opg', // Pedro Coves Feb 26 - Commented out to allow normal classification
    ];

    if (eventId && forceVideoIds.some(id => eventId.includes(id))) {
        const urlRegex = /https?:\/\/[^\s"'<>\]\[]+[^\s"<>\]\[.,;?]/g;
        const localMatches = cleanDescription.match(urlRegex);

        const driveLink = localMatches?.find(url => url.toLowerCase().includes('drive.google.com'));
        if (driveLink) {
            return { video: driveLink, pdf: null, meet: null, extraVideos: [], videoType: 'class' };
        }
    }

    const urlRegex = /https?:\/\/[^\s"'<>\]\[]+[^\s"<>\]\[.,;?]/g;
    const matches = cleanDescription.match(urlRegex) || [];

    // Initialize candidates
    const videoCandidates: { url: string, score: number, type: 'class' | 'preview' }[] = [];
    const materialCandidates: { url: string, score: number }[] = [];
    const otherLinks: string[] = [];
    const unassignedLinks: string[] = [];

    const videoPlatforms = ['youtube.com', 'youtu.be', 'vimeo.com', 'vertice.cpd.ua.es', 'panopto.com'];
    const sessionPlatforms = ['meet.google.com', 'zoom.us', 'teams.microsoft.com'];
    const descLower = cleanDescription.toLowerCase();

    // 1. Process Text Links
    for (const url of matches) {
        const urlLower = url.toLowerCase();
        const index = cleanDescription.indexOf(url);
        const context = index > -1 ? cleanDescription.substring(Math.max(0, index - 100), index).toLowerCase() : "";

        // MATERIAL DETECTION
        const isExplicitMaterial = context.includes('contenidos') || context.includes('material') || context.includes('presentación') || context.includes('presentacion');
        const isFile = urlLower.endsWith('.pdf') || urlLower.endsWith('.zip') || urlLower.endsWith('.pptx');

        // VIDEO DETECTION
        const isVideoPlatform = videoPlatforms.some(platform => urlLower.includes(platform));
        const isExplicitDriveVideo = urlLower.includes('drive.google.com') && (urlLower.includes('video') || urlLower.includes('mov') || urlLower.includes('mp4') || urlLower.includes('m4v'));
        const isContextualDriveVideo = urlLower.includes('drive.google.com') && (
            (context.includes('grabación') || context.includes('grabacion')) ||
            (context.includes('sesión') && !context.includes('contenidos') && !context.includes('material')) ||
            (context.includes('clase') && !context.includes('contenidos') && !context.includes('material')) ||
            (context.includes('video'))
        );

        if (isExplicitMaterial) {
            materialCandidates.push({ url, score: 10 });
        } else if (isFile) {
            materialCandidates.push({ url, score: 5 });
        } else if (isVideoPlatform || isExplicitDriveVideo || isContextualDriveVideo) {
            let score = 0;
            let type: 'class' | 'preview' = 'preview';

            // REVISED CLASSIFICATION FOR USER REQUEST
            // "Grabación" -> Class Video (Post-session)
            // Everything else -> Preview Video (Pre-session, "Video experto" merged here)

            if (context.includes('grabación') || context.includes('grabacion')) {
                score = 10;
                type = 'class';
            } else if (context.includes('clase') || context.includes('clase:') || /video\s*\d+/i.test(context)) {
                // "Video N" or "Clase:" maps to Preview
                score = 10;
                type = 'preview';
            } else if (context.includes('sesión') || context.includes('sesion')) {
                score = 3;
                type = 'preview';
            } else {
                score = 1;
                type = 'preview';
            }
            videoCandidates.push({ url, score, type });
        } else {
            otherLinks.push(url);
        }
    }

    // 2. Process Attachments
    if (attachments && attachments.length > 0) {
        attachments.forEach(att => {
            if (att.mimeType && att.mimeType.startsWith('video/')) {
                // High priority for attached videos (Recordings)
                videoCandidates.push({
                    url: att.fileUrl,
                    score: 20, // Higher than any text match
                    type: 'class'
                });
            } else if (att.mimeType === 'application/pdf') {
                materialCandidates.push({
                    url: att.fileUrl,
                    score: 20
                });
            }
        });
    }

    videoCandidates.sort((a, b) => b.score - a.score);
    materialCandidates.sort((a, b) => b.score - a.score);

    let videoLink: string | null = null;
    let videoType: 'class' | 'preview' | undefined;
    let extraVideos: { url: string; type: 'class' | 'preview' }[] = [];

    if (videoCandidates.length > 0) {
        const winner = videoCandidates[0];
        videoLink = winner.url;
        videoType = winner.type;

        const others = videoCandidates.slice(1);
        others.forEach(candidate => {
            if (candidate.url !== videoLink) {
                if (!extraVideos.some(ev => ev.url === candidate.url)) {
                    extraVideos.push({ url: candidate.url, type: candidate.type });
                }
            }
        });
    }

    let pdfLink: string | null = null;
    if (materialCandidates.length > 0) {
        pdfLink = materialCandidates[0].url;
    }

    let meetLink: string | null = null;
    for (const url of otherLinks) {
        const urlLower = url.toLowerCase();
        if (sessionPlatforms.some(platform => urlLower.includes(platform)) && !meetLink) {
            meetLink = url;
            continue;
        }
        unassignedLinks.push(url);
    }

    if (!videoLink && extraVideos.length > 0) {
        if (descLower.includes('grabación') || descLower.includes('video')) {
            const promoted = extraVideos.shift();
            if (promoted) {
                videoLink = promoted.url;
                videoType = promoted.type;
            }
        }
    }

    if (!pdfLink && unassignedLinks.length > 0) {
        const driveFallback = unassignedLinks.find(u => u.includes('drive.google.com'));
        if (driveFallback) {
            pdfLink = driveFallback;
        } else {
            const potentialPdf = unassignedLinks.find(u => u.endsWith('.pdf') || u.endsWith('.zip'));
            if (potentialPdf) pdfLink = potentialPdf;
        }
    }

    return { video: videoLink, pdf: pdfLink, meet: meetLink, extraVideos, videoType };
}

function extractSessionType(description: string): string | null {
    if (!description) return null;
    // Stop strictly at URLs
    const typeRegex = /(?:Tipo de sesión|Sesión|Categoría):\s*([^\n#<|]+?)(?=\s*(?:https?:\/\/)|$)/i;
    const match = description.match(typeRegex);
    return match && match[1] ? match[1].trim() : null;
}

function extractProfessor(description: string, title?: string): { id: string, name: string } | null {
    let nameToSlugify: string | null = null;

    // 1. Try extracting from description with improved regex
    if (description) {
        // Stop at common metadata labels or links
        const professorRegex = /(?:Profesor|Ponente|Docente|Instructor|Experto):\s*([^\n#<|]+?)(?=\s*(?:Tipo de sesión|Sesión|Categoría|https?:\/\/)|$)/i;
        const match = description.match(professorRegex);
        if (match && match[1]) {
            nameToSlugify = match[1].trim().replace(/[,;]+$/, "");
        }
    }

    // 2. Fallback: Try extracting from title (pattern: "... - Name")
    if (!nameToSlugify && title && title.includes(" - ")) {
        const parts = title.split(" - ");
        const potentialName = parts[parts.length - 1].trim();
        const wordCount = potentialName.split(/\s+/).length;
        if (wordCount >= 2 && wordCount <= 5) {
            nameToSlugify = potentialName;
        }
    }

    if (nameToSlugify) {
        // Strip academic titles and common prefixes for the slug
        const cleanName = nameToSlugify
            .replace(/^(Dr\.|Dra\.|Prof\.|Profesor\.|Ponente\.)\s+/i, "")
            .trim();

        const id = cleanName
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Remove accents
            .replace(/[^a-z0-9]+/g, "-")    // Replace special chars with -
            .replace(/^-+|-+$/g, "");      // Trim -

        return { id, name: nameToSlugify };
    }

    return null;
}

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
    if (!API_KEY || !CALENDAR_ID) {
        console.warn("Google Calendar API Key or ID missing. Using mock data.");
        return getMockEvents();
    }

    try {
        const timeMin = new Date(Date.now() - 86400000 * 180).toISOString(); // Last 180 days
        const response = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?key=${API_KEY}&timeMin=${timeMin}&singleEvents=true&orderBy=startTime`,
            { cache: 'no-store' }
        );

        if (!response.ok) {
            throw new Error(`Calendar API responded with ${response.status}`);
        }

        const data = await response.json();
        const now = new Date();

        return data.items.map((item: any) => {
            const start = new Date(item.start.dateTime || item.start.date);
            const end = new Date(item.end.dateTime || item.end.date);
            const rawDescription = item.description || "";
            const cleanedDescription = cleanText(rawDescription);
            const sType = extractSessionType(cleanedDescription);
            const links = extractLinks(cleanedDescription, item.summary, sType, item.id, item.attachments);

            const prof = extractProfessor(cleanedDescription, item.summary);

            return {
                id: item.id,
                title: item.summary || "Sin título",
                description: cleanedDescription,
                start: start.toISOString(),
                end: end.toISOString(),
                videoLink: links.video,
                pdfLink: links.pdf,
                meetLink: item.hangoutLink || links.meet,
                professorId: prof ? prof.id : null,
                professorName: prof ? prof.name : null,
                sessionType: sType,
                type: start < now ? "past" : "future",
                location: item.location,
                tags: extractTags(rawDescription),
                extraVideos: links.extraVideos,
                videoType: links.videoType
            };
        });
    } catch (error) {
        console.error("Error fetching calendar events:", error);
        return getMockEvents();
    }
}

function getMockEvents(): CalendarEvent[] {
    const now = new Date();
    return [
        {
            id: "mock-1",
            title: "Sesión: Fundamentos del Mercado (Grabación)",
            description: "Repaso de la cadena de valor global. \n\nGrabación disponible: https://youtube.com/watch?v=mock1 \nMaterial técnico: https://agro-example.com/assets.zip #Mercado #Fundamentos",
            start: new Date(now.getTime() - 86400000 * 2).toISOString(),
            end: new Date(now.getTime() - 86400000 * 2 + 3600000).toISOString(),
            videoLink: "https://youtube.com/watch?v=mock1",
            pdfLink: "https://agro-example.com/assets.zip",
            meetLink: null,
            professorId: "elena-martinez",
            professorName: "Elena Martínez",
            sessionType: "Grabación",
            type: "past",
            tags: ["Mercado", "Fundamentos"],
            extraVideos: []
        },
        {
            id: "mock-2",
            title: "En Vivo: Q&A Cultivo Interior",
            description: "Sesión de preguntas y respuestas. \n\nMaterial previo: https://youtube.com/watch?v=prework1 \nGuía de cultivo: https://drive.google.com/file/d/mockpdf/view #Indoor #QA",
            start: new Date(now.getTime() + 86400000 * 3).toISOString(),
            end: new Date(now.getTime() + 86400000 * 3 + 3600000).toISOString(),
            videoLink: "https://youtube.com/watch?v=prework1",
            pdfLink: "https://drive.google.com/file/d/mockpdf/view",
            meetLink: "https://meet.google.com/mock-meet",
            professorId: "javier-ferrandez",
            professorName: "Javier Ferrández",
            sessionType: "Q&A",
            type: "future",
            tags: ["Indoor", "QA"],
            extraVideos: []
        }
    ];
}
