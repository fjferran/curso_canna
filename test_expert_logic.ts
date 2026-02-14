
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
    let pdfLink: string | null = null;
    let meetLink: string | null = null;

    const videoPlatforms = ['youtube.com', 'youtu.be', 'drive.google.com'];
    const sessionPlatforms = ['meet.google.com', 'zoom.us'];

    // Simulated extractLinks logic from lib/calendar.ts
    const videoCandidates: { url: string, score: number }[] = [];
    const otherLinks: string[] = [];

    for (const url of matches) {
        const urlLower = url.toLowerCase();
        const index = cleanDescription.indexOf(url);
        const context = index > -1 ? cleanDescription.substring(Math.max(0, index - 100), index).toLowerCase() : "";

        let isVideo = false;
        let score = 0;

        const isVideoPlatform = videoPlatforms.some(platform => urlLower.includes(platform));
        const isExplicitDrive = urlLower.includes('drive.google.com') && (urlLower.includes('video') || urlLower.includes('mov') || urlLower.includes('mp4') || urlLower.includes('m4v'));
        const isContextualDrive = urlLower.includes('drive.google.com') && (
            context.includes('grabación') || context.includes('sesión') || (context.includes('clase') && !context.includes('material')) ||
            context.includes('video')
        );

        if (isVideoPlatform || isExplicitDrive || isContextualDrive) {
            isVideo = true;
            if (context.includes('clase:') || context.includes('clase :')) score = 10;
            else if (context.includes('grabación')) score = 5;
            else if (context.includes('sesión')) score = 3;
            else if (context.includes('video')) score = 1;
        }

        if (isVideo) {
            videoCandidates.push({ url, score });
        } else {
            otherLinks.push(url);
        }
    }

    videoCandidates.sort((a, b) => b.score - a.score);

    if (videoCandidates.length > 0) {
        videoLink = videoCandidates[0].url;
        extraVideos = videoCandidates.slice(1).map(v => v.url);
    }

    // Is Expert check
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

const tests = [
    {
        name: "Standard Clase",
        input: "Profesor: Name. Clase: https://drive.google.com/video1.mp4",
        expected: { isExpertVideo: true, videoContains: "video1" }
    },
    {
        name: "Clase with Space",
        input: "Profesor: Name. Clase : https://drive.google.com/video2.mp4",
        expected: { isExpertVideo: true, videoContains: "video2" }
    },
    {
        name: "Priority over Video 1",
        input: "Video 1: https://drive.google.com/v1.mp4 Clase: https://drive.google.com/expert.mp4",
        expected: { isExpertVideo: true, videoContains: "expert" }
    },
    {
        name: "Priority over Grabación",
        input: "Grabación: https://drive.google.com/rec.mp4 Clase: https://drive.google.com/expert.mp4",
        expected: { isExpertVideo: true, videoContains: "expert" }
    },
    {
        name: "Lowercase clase",
        input: "clase: https://drive.google.com/lower.mp4",
        expected: { isExpertVideo: true, videoContains: "lower" }
    },
    {
        name: "No Experto (Grabación only)",
        input: "Grabación: https://drive.google.com/rec.mp4",
        expected: { isExpertVideo: false, videoContains: "rec" }
    }
];

tests.forEach(test => {
    const result = extractLinks(cleanText(test.input));
    const passed = result.isExpertVideo === test.expected.isExpertVideo &&
        (result.video && result.video.includes(test.expected.videoContains));
    console.log(`Test "${test.name}": ${passed ? "PASSED" : "FAILED"}`);
    if (!passed) console.log("  Got:", result);
});
