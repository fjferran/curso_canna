
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

    // Simplified extraction for test
    for (const url of matches) {
        if (url.includes('drive') || url.includes('youtube')) {
            videoLink = url;
            break;
        }
    }

    if (videoLink) {
        const index = cleanDescription.indexOf(videoLink);
        if (index > -1) {
            const context = cleanDescription.substring(Math.max(0, index - 100), index).toLowerCase();
            console.log("Context found:", context);

            // Current logic
            if (context.includes('clase:') || context.includes('clase :')) {
                isExpertVideo = true;
            }
        }
    }

    return { video: videoLink, isExpertVideo };
}

const inputs = [
    "Clase: (video) https://drive.google.com/file/d/123",
    "CLASE: https://youtu.be/123",
    "Clase magistral: https://youtu.be/456",
    "Clase (sin dos puntos) https://youtu.be/789"
];

inputs.forEach(input => {
    console.log(`\nInput: "${input}"`);
    console.log(`Result:`, extractLinks(cleanText(input)));
});
