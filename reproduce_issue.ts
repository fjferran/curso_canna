
// Mocking the cleanText function from calendar.ts
function cleanText(text: string): string {
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

// Mocking extractLinks with the CURRENT logic (approximately) to reproduce failure
function extractLinks(cleanDescription: string): any {
    const urlRegex = /https?:\/\/[^\s"'<>\]\[]+[^\s"<>\]\[.,;?]/g;
    const matches = cleanDescription.match(urlRegex);

    if (!matches) return { video: null, pdf: null, meet: null, extraVideos: [] };

    let videoLink: string | null = null;
    let pdfLink: string | null = null;
    let meetLink: string | null = null;
    let extraVideos: string[] = [];
    const unassignedLinks: string[] = [];

    const videoPlatforms = [
        'youtube.com', 'youtu.be', 'vimeo.com', 'vertice.cpd.ua.es', 'panopto.com'
    ];

    const sessionPlatforms = [
        'meet.google.com', 'zoom.us', 'teams.microsoft.com'
    ];

    const descLower = cleanDescription.toLowerCase();

    // Context helper
    const isMainVideoContext = (url: string) => {
        const index = cleanDescription.indexOf(url);
        if (index === -1) return false;
        const context = cleanDescription.substring(Math.max(0, index - 100), index).toLowerCase();
        return context.includes('grabación') || context.includes('sesión') || (context.includes('clase') && !context.includes('material'));
    };

    // New helper for generic video context (what I SHOULD add/fix)
    // currently effectively what I have implies looking for "video" string literal next to url

    for (const url of matches) {
        const urlLower = url.toLowerCase();
        let assigned = false;

        const isVideoPlatform = videoPlatforms.some(platform => urlLower.includes(platform));

        // Exact logic from current file
        const isExplicitDriveVideo = urlLower.includes('drive.google.com') && (urlLower.includes('video') || urlLower.includes('mov') || urlLower.includes('mp4') || urlLower.includes('m4v'));

        // The problematic logic fixed:
        // We need to look for "video" BEFORE the url in the clean text
        const index = cleanDescription.indexOf(url);
        const contextBefore = index > -1 ? cleanDescription.substring(Math.max(0, index - 50), index).toLowerCase() : "";

        // Check if "video" or "sesión" is in the immediate context (e.g. "Video 1: ", "Video Sesión:")
        // But exclude if "material" or "contenido" is also there to avoid false positives? 
        // Actually, just checking if "video" is present in the 20-30 chars before is usually enough.
        const isContextualDriveVideo = urlLower.includes('drive.google.com') && (
            isMainVideoContext(url) ||
            contextBefore.includes('video') ||
            contextBefore.includes('grabación') ||
            contextBefore.includes('clase')
        );

        if (isVideoPlatform || isExplicitDriveVideo || isContextualDriveVideo) {
            if (!videoLink && isMainVideoContext(url)) {
                videoLink = url;
                assigned = true;
            } else {
                extraVideos.push(url);
                assigned = true;
            }
        }

        const isDownloadable = urlLower.endsWith('.pdf') || urlLower.endsWith('.zip') || urlLower.includes('drive.google.com');

        if (!assigned && isDownloadable) {
            if (!pdfLink) {
                pdfLink = url;
                assigned = true;
            }
        }

        // Meet logic omitted for brevity

        if (!assigned) {
            unassignedLinks.push(url);
        }
    }

    // Fallbacks logic
    if (!videoLink && extraVideos.length > 0) {
        if (descLower.includes('grabación') || descLower.includes('video')) {
            videoLink = extraVideos.shift() || null;
        }
    }
    if (!pdfLink && unassignedLinks.length > 0) pdfLink = unassignedLinks.shift() || null;


    return { video: videoLink, pdf: pdfLink, extraVideos };
}

const inputDescription = `Profesor: Ricardo Suay, Tipo sesión: Sesión síncrona,
Video 1: https://drive.google.com/file/d/17gslOjMI2Jp-vjJwJ5O2vwuEtNgj2mM8/view?usp=drive_link
Video 2: https://drive.google.com/file/d/1LMhi7BvrOPNJuMIxr5v3rbXRvjm0TqXm/view?usp=drive_link
Contenidos: https://drive.google.com/file/d/1NNc7kkC5FQthuiATiGf2eP42FWQnwjym/view?usp=drive_link`;

const cleaned = cleanText(inputDescription);
console.log("Input:", inputDescription);
console.log("Cleaned:", cleaned);
console.log("Result:", JSON.stringify(extractLinks(cleaned), null, 2));
