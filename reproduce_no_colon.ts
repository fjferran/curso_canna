
function cleanText(text: string): string {
    if (!text) return "";
    return text.replace(/\s+/g, ' ').trim();
}

function extractLinks(cleanDescription: string): { video: string | null, isExpertVideo: boolean } {
    const urlRegex = /https?:\/\/[^\s"'<>\]\[]+[^\s"<>\]\[.,;?]/g;
    const matches = cleanDescription.match(urlRegex);

    if (!matches) return { video: null, isExpertVideo: false };

    let videoLink: string | null = null;
    let isExpertVideo = false;

    const videoCandidates: { url: string, score: number }[] = [];

    // Logic from lib/calendar.ts
    const videoPlatforms = ['youtube.com', 'drive.google.com'];

    for (const url of matches) {
        const urlLower = url.toLowerCase();
        const index = cleanDescription.indexOf(url);
        const context = index > -1 ? cleanDescription.substring(Math.max(0, index - 100), index).toLowerCase() : "";

        let isVideo = false;
        let score = 0;

        const isVideoPlatform = videoPlatforms.some(platform => urlLower.includes(platform));
        const isContextualDrive = urlLower.includes('drive.google.com') && (
            context.includes('grabación') || context.includes('sesión') || (context.includes('clase') && !context.includes('material')) ||
            context.includes('video')
        );

        if (isVideoPlatform || isContextualDrive) {
            isVideo = true;
            // Current strict check:
            if (context.includes('clase:') || context.includes('clase :')) score = 10;
            else if (context.includes('grabación')) score = 5;
            else if (context.includes('sesión')) score = 3;
            else if (context.includes('video')) score = 1;
        }

        if (isVideo) {
            videoCandidates.push({ url, score });
        }
    }

    videoCandidates.sort((a, b) => b.score - a.score);

    if (videoCandidates.length > 0) {
        videoLink = videoCandidates[0].url;
    }

    if (videoLink) {
        const index = cleanDescription.indexOf(videoLink);
        if (index > -1) {
            const context = cleanDescription.substring(Math.max(0, index - 100), index).toLowerCase();
            // Current strict check
            if (context.includes('clase:') || context.includes('clase :')) {
                isExpertVideo = true;
            }
        }
    }

    return { video: videoLink, isExpertVideo };
}

console.log("Testing Clase without colon...");
const res1 = extractLinks("Video 1: https://drive.google.com/v1.mp4 Clase https://drive.google.com/clase.mp4");
console.log("Result 1 (Clase no colon):", res1);
// Expectation: video might be v1 (score 1) vs class (score 0 if implies contextual but missed score).
// Actually contextual detects 'clase', so isVideo=true. But score defaults to 0? 
// Wait, my logic initialized score=0.
// So v1 gets score 1 ("video"), Clase gets score 0.
// v1 wins. Correct.
