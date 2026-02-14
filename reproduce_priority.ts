
function cleanText(text: string): string {
    if (!text) return "";
    return text.replace(/\s+/g, ' ').trim();
}

function extractLinks(cleanDescription: string): { video: string | null, extraVideos: string[], isExpertVideo: boolean } {
    const urlRegex = /https?:\/\/[^\s"'<>\]\[]+[^\s"<>\]\[.,;?]/g;
    const matches = cleanDescription.match(urlRegex);

    if (!matches) return { video: null, extraVideos: [], isExpertVideo: false };

    let videoLink: string | null = null;
    let extraVideos: string[] = [];
    let isExpertVideo = false;

    // Current logic simulation
    const videoPlatforms = ['youtube.com', 'youtu.be', 'drive.google.com']; // Simplified

    // Helper context
    const isMainVideoContext = (url: string) => {
        const index = cleanDescription.indexOf(url);
        if (index === -1) return false;
        const context = cleanDescription.substring(Math.max(0, index - 100), index).toLowerCase();
        return context.includes('grabación') || context.includes('sesión') || (context.includes('clase') && !context.includes('material'));
    };

    for (const url of matches) {
        let assigned = false;
        const urlLower = url.toLowerCase();

        // Simplified drive check
        const isDriveVideo = urlLower.includes('drive') && (isMainVideoContext(url) || cleanDescription.toLowerCase().includes('video')); // simplified regex

        if (videoPlatforms.some(p => urlLower.includes(p)) || isDriveVideo) {
            if (!videoLink && isMainVideoContext(url)) {
                videoLink = url;
                assigned = true;
            } else {
                extraVideos.push(url);
                assigned = true;
            }
        }
    }

    if (videoLink) {
        const index = cleanDescription.indexOf(videoLink);
        if (index > -1) {
            const context = cleanDescription.substring(Math.max(0, index - 100), index).toLowerCase();
            if (context.includes('clase:') || context.includes('clase :')) {
                isExpertVideo = true;
            }
        }
    }

    return { video: videoLink, extraVideos, isExpertVideo };
}

const input = `Profesor: Herminia Puerto, Tipo Sesión: Sesión síncrona,
Video 1: https://drive.google.com/file/d/VIDEO1/view?usp=drive_link
Video 2: https://drive.google.com/file/d/VIDEO2/view?usp=drive_link
Contenidos: https://drive.google.com/file/d/CONTENT/view?usp=drive_link
Clase: https://drive.google.com/file/d/CLASE/view?usp=drive_link`;

const cleaned = cleanText(input);
console.log("Input cleaned:", cleaned);
console.log("Result:", extractLinks(cleaned));
