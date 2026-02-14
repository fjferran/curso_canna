
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
        // Here is the issue in current code? 
        // No, current code does uses indexOf inside the loop too?
        // Let's check the code I wrote in lib/calendar.ts
        /*
        const index = cleanDescription.indexOf(url);
        const context = index > -1 ? cleanDescription.substring...
        */
        // YES! The loop ALSO uses indexOf!
        // So even inside the loop, for the second occurrence of the URL, indexOf returns the position of the FIRST occurrence.
        // So the context is ALWAYS calculated for the first occurrence.

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
            if (context.includes('clase:') || context.includes('clase :')) score = 10;
            else if (context.includes('clase')) score = 9;
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
            if (context.includes('clase:') || context.includes('clase :') || context.includes('clase')) {
                isExpertVideo = true;
            }
        }
    }

    return { video: videoLink, isExpertVideo };
}

const input = `Video 2: https://drive.google.com/file/d/DUPLICATE/view?usp=drive_link
CLASE: https://drive.google.com/file/d/DUPLICATE/view?usp=drive_link`;

console.log("Testing with Duplicate Link...");
const res = extractLinks(cleanText(input));
console.log("Result:", res);
