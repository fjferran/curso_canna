
const fs = require('fs');
const path = require('path');

// Load environment variables manually
try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
        const envFile = fs.readFileSync(envPath, 'utf8');
        envFile.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                let value = match[2].trim();
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                }
                process.env[key] = value;
            }
        });
    } else {
        console.warn(".env.local file not found at", envPath);
    }
} catch (e) {
    console.warn("Could not load .env.local", e);
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY;
const CALENDAR_ID = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;

function cleanText(text) {
    if (!text) return "";
    return text
        .replace(/<[^>]*>?/gm, ' ')
        .split('&nbsp;').join(' ')
        .split('&quot;').join('"')
        .split('&lt;').join('<')
        .split('&gt;').join('>')
        .split('&amp;').join('&')
        .replace(/\s+/g, ' ')
        .trim();
}

function extractSessionType(description) {
    if (!description) return null;
    const typeRegex = /(?:Tipo de sesión|Sesión|Categoría):\s*([^\n#<|]+?)(?=\s*(?:https?:\/\/)|$)/i;
    const match = description.match(typeRegex);
    return match && match[1] ? match[1].trim() : null;
}

function extractLinks(cleanDescription, title, sessionType, eventId, attachments = []) {
    // Manual overrides for specific problematic events
    const forceVideoIds = [
        // '_8d9lcgrfdpr6asjk71j32cpnc5i32c1p71h36e32clj66eb56koj0chp6tijadb56opg', // Pedro Coves Feb 26 - Commented out
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
    const videoCandidates = [];
    const materialCandidates = [];
    const otherLinks = [];
    const unassignedLinks = [];
    const videoPlatforms = ['youtube.com', 'youtu.be', 'vimeo.com', 'vertice.cpd.ua.es', 'panopto.com'];
    const sessionPlatforms = ['meet.google.com', 'zoom.us', 'teams.microsoft.com'];

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
            let type = 'preview';

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

    let videoLink = null;
    let videoType;
    let extraVideos = [];

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

    let pdfLink = null;
    if (materialCandidates.length > 0) {
        pdfLink = materialCandidates[0].url;
    }

    let meetLink = null;
    for (const url of otherLinks) {
        const urlLower = url.toLowerCase();
        if (sessionPlatforms.some(platform => urlLower.includes(platform)) && !meetLink) {
            meetLink = url;
            continue;
        }
        unassignedLinks.push(url);
    }

    // Fallbacks (same as before)
    const descLower = cleanDescription.toLowerCase();
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

async function debugMesaRedonda() {
    console.log("Fetching calendar events for February...");

    if (!API_KEY || !CALENDAR_ID) {
        console.error("Missing credentials");
        return;
    }

    // Set time range to cover February 2026 (or 2025/2026 depending on current year in context)
    // Assuming the user is working on current events. The previous context had "Last 180 days".
    // Let's look at the last 365 days
    const timeMin = new Date(Date.now() - 86400000 * 365).toISOString();

    try {
        const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?key=${API_KEY}&timeMin=${timeMin}&singleEvents=true&orderBy=startTime`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data.items) {
            console.log("No items found or error", data);
            return;
        }

        const events = data.items.filter(item => {
            const s = (item.summary || "").toLowerCase();
            const d = (item.description || "").toLowerCase();
            return s.includes('bosco') || s.includes('morales') || d.includes('bosco') || d.includes('morales');
        });

        console.log(`Found ${events.length} events for Bosco/Morales in last 365 days.`);

        events.forEach(item => {
            const start = item.start.dateTime || item.start.date;
            console.log(`\n---------------------------------------------------`);
            console.log(`Event: ${item.summary} (${start})`);
            console.log(`ID: ${item.id}`);
            console.log(`\n[FULL RAW DESCRIPTION]:\n${JSON.stringify(item.description)}\n`);

            const cleaned = cleanText(item.description || "");
            console.log(`\n[CLEANED DESCRIPTION]:\n${cleaned}\n`);
            const sType = extractSessionType(cleaned);
            console.log(`[SESSION TYPE]: ${sType}`);
            const links = extractLinks(cleaned, item.summary, sType, item.id, item.attachments);
            console.log(`[EXTRACTED LINKS]:`, JSON.stringify(links, null, 2));
        });

    } catch (error) {
        console.error("Error:", error);
    }
}

debugMesaRedonda();
