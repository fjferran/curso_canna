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
    extraVideos: { url: string; isExpert: boolean }[];
    isExpertVideo?: boolean;
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

export function extractLinks(cleanDescription: string, title?: string, sessionType?: string | null, eventId?: string): { video: string | null, pdf: string | null, meet: string | null, extraVideos: { url: string; isExpert: boolean }[], isExpertVideo: boolean } {
    // Manual overrides for specific problematic events
    const forceVideoIds = [
        '_8d9lcgrfdpr6asjk71j32cpnc5i32c1p71h36e32clj66eb56koj0chp6tijadb56opg', // Pedro Coves Feb 26
        // '_8d9lcgrfdpr6asjkc8r32phk69h3ae9l6gojce33c8rm4eb1cgqm2dpocgr3ccj5cgp0', // Gregorio Bigatti - GM21-1 Fundamentos
    ];

    if (eventId && forceVideoIds.some(id => eventId.includes(id))) {
        // We need to re-run matches here because cleanDescription might not have matches if we returned early
        const urlRegex = /https?:\/\/[^\s"'<>\]\[]+[^\s"<>\]\[.,;?]/g;
        const localMatches = cleanDescription.match(urlRegex);

        const driveLink = localMatches?.find(url => url.toLowerCase().includes('drive.google.com'));
        if (driveLink) {
            if (driveLink) {
                return { video: driveLink, pdf: null, meet: null, extraVideos: [], isExpertVideo: false };
            }
        }
    }

    // 2. Extract URLs using a robust regex that stops at common separators
    const urlRegex = /https?:\/\/[^\s"'<>\]\[]+[^\s"<>\]\[.,;?]/g;
    const matches = cleanDescription.match(urlRegex);

    if (!matches) return { video: null, pdf: null, meet: null, extraVideos: [], isExpertVideo: false };

    let videoLink: string | null = null;
    let pdfLink: string | null = null;
    let meetLink: string | null = null;
    let extraVideos: { url: string; isExpert: boolean }[] = [];
    const unassignedLinks: string[] = [];

    const videoPlatforms = [
        'youtube.com', 'youtu.be', 'vimeo.com', 'vertice.cpd.ua.es', 'panopto.com'
    ];

    const sessionPlatforms = [
        'meet.google.com', 'zoom.us', 'teams.microsoft.com'
    ];

    const descLower = cleanDescription.toLowerCase();

    const videoCandidates: { url: string, score: number, isExpert: boolean }[] = [];
    const otherLinks: string[] = [];

    for (const url of matches) {
        const urlLower = url.toLowerCase();
        const index = cleanDescription.indexOf(url);
        const context = index > -1 ? cleanDescription.substring(Math.max(0, index - 100), index).toLowerCase() : "";

        const isVideoPlatform = videoPlatforms.some(platform => urlLower.includes(platform));
        const isExplicitDrive = urlLower.includes('drive.google.com') && (urlLower.includes('video') || urlLower.includes('mov') || urlLower.includes('mp4') || urlLower.includes('m4v'));

        const isContextualDrive = urlLower.includes('drive.google.com') && (
            (context.includes('grabación') || context.includes('grabacion')) ||
            (context.includes('sesión') && !context.includes('contenidos') && !context.includes('material')) ||
            (context.includes('clase') && !context.includes('contenidos') && !context.includes('material')) ||
            (context.includes('video'))
        );

        if (isVideoPlatform || isExplicitDrive || isContextualDrive) {
            let score = 0;
            let expertFlag = false;

            if (context.includes('clase') || context.includes('clase:') || context.includes('clase :') ||
                context.includes('grabación') || context.includes('grabacion') ||
                /video\s*\d+/i.test(context)) {
                score = 10;
                expertFlag = true;
            } else if (context.includes('sesión') || context.includes('sesion')) {
                score = 3;
            } else {
                score = 1;
            }

            videoCandidates.push({ url, score, isExpert: expertFlag });
        } else {
            otherLinks.push(url);
        }
    }

    // Sort candidates
    videoCandidates.sort((a, b) => b.score - a.score);

    // Assign
    let isExpertVideo = false;
    if (videoCandidates.length > 0) {
        const winner = videoCandidates[0];
        videoLink = winner.url;

        if (videoCandidates.some(c => c.url === videoLink && c.isExpert)) {
            isExpertVideo = true;
        }

        const others = videoCandidates.slice(1);
        others.forEach(candidate => {
            if (candidate.url !== videoLink && !extraVideos.some(ev => ev.url === candidate.url)) {
                extraVideos.push({ url: candidate.url, isExpert: candidate.isExpert });
            }
        });
    }

    // Fallbacks
    for (const url of otherLinks) {
        const urlLower = url.toLowerCase();
        const isDownloadable = urlLower.endsWith('.pdf') || urlLower.endsWith('.zip') || urlLower.includes('drive.google.com');

        if (isDownloadable && !pdfLink) {
            pdfLink = url;
        } else if (sessionPlatforms.some(platform => urlLower.includes(platform)) && !meetLink) {
            meetLink = url;
        } else {
            unassignedLinks.push(url);
        }
    }

    if (!videoLink && extraVideos.length > 0) {
        if (descLower.includes('grabación') || descLower.includes('video')) {
            const promoted = extraVideos.shift();
            if (promoted) {
                videoLink = promoted.url;
                if (promoted.isExpert) isExpertVideo = true;
            }
        }
    }

    if (!pdfLink && unassignedLinks.length > 0) pdfLink = unassignedLinks.shift() || null;

    return { video: videoLink, pdf: pdfLink, meet: meetLink, extraVideos, isExpertVideo };
}

function extractSessionType(description: string): string | null {
    if (!description) return null;
    // Stop strictly at URLs
    const typeRegex = /(?:Tipo de sesión|Sesión|Categoría):\s*([^\n#<|]+?)(?=\s*https?:\/\/|$)/i;
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
            `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?key=${API_KEY}&timeMin=${timeMin}&singleEvents=true&orderBy=startTime`
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
            const links = extractLinks(cleanedDescription, item.summary, sType, item.id);
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
                isExpertVideo: links.isExpertVideo
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
