
// Test script to reproduce and fix link extraction logic
export { };

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

function extractLinks(cleanDescription: string): any {
    const urlRegex = /https?:\/\/[^\s"'<>\]\[]+[^\s"<>\]\[.,;?]/g;
    const matches = cleanDescription.match(urlRegex) || [];

    const videoCandidates: { url: string, score: number, type: 'class' | 'preview' }[] = [];
    const materialCandidates: { url: string, score: number }[] = [];
    const otherLinks: string[] = [];
    const unassignedLinks: string[] = [];

    const videoPlatforms = ['youtube.com', 'youtu.be', 'vimeo.com', 'vertice.cpd.ua.es', 'panopto.com'];
    const sessionPlatforms = ['meet.google.com', 'zoom.us', 'teams.microsoft.com'];
    const descLower = cleanDescription.toLowerCase();

    for (const url of matches) {
        const urlLower = url.toLowerCase();
        const index = cleanDescription.indexOf(url);
        const context = index > -1 ? cleanDescription.substring(Math.max(0, index - 100), index).toLowerCase() : "";

        const isExplicitMaterial = context.includes('contenidos') || context.includes('material') || context.includes('presentación') || context.includes('presentacion');
        const isFile = urlLower.endsWith('.pdf') || urlLower.endsWith('.zip') || urlLower.endsWith('.pptx');

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

            if (context.includes('grabación') || context.includes('grabacion')) {
                score = 10;
                type = 'class';
            } else if (context.includes('clase') || context.includes('clase:') || /video\s*\d+/i.test(context)) {
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

// Test cases
const inputDescription = `Profesor: Ricardo Suay, Tipo sesión: Sesión síncrona,
Video 1: https://drive.google.com/file/d/17gslOjMI2Jp-vjJwJ5O2vwuEtNgj2mM8/view?usp=drive_link
Video 2: https://drive.google.com/file/d/1LMhi7BvrOPNJuMIxr5v3rbXRvjm0TqXm/view?usp=drive_link
Contenidos: https://drive.google.com/file/d/1NNc7kkC5FQthuiATiGf2eP42FWQnwjym/view?usp=drive_link`;

const cleaned = cleanText(inputDescription);
console.log("=== Test Output ===");
console.log("Input text:\n", inputDescription);
console.log("\nCleaned text:\n", cleaned);
console.log("\nExtracted Links:\n", JSON.stringify(extractLinks(cleaned), null, 2));
