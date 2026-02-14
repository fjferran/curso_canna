const { getCalendarEvents } = require('./lib/calendar_debug');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

async function debugMesaRedonda() {
    console.log("Fetching calendar events...");
    try {
        const events = await getCalendarEvents();
        console.log(`Fetched ${events.length} events.`);

        const mesaRedonda = events.find((e: any) => e.title.includes("Mesa redonda") && e.title.includes("prueba"));

        if (!mesaRedonda) {
            console.error("Could not find event with title containing 'Mesa redonda' and 'prueba'");
            console.log("Available titles:", events.slice(0, 10).map((e: any) => e.title));
            return;
        }

        console.log("\n--- FOUND EVENT ---");
        console.log("Title:", mesaRedonda.title);
        console.log("Description (Raw):", JSON.stringify(mesaRedonda.description)); // Show hidden chars
        console.log("ID:", mesaRedonda.id);

        console.log("\n--- PARSED LINKS ---");
        console.log("Video:", mesaRedonda.videoLink);
        console.log("Is Expert:", mesaRedonda.isExpertVideo);
        console.log("PDF:", mesaRedonda.pdfLink);
        console.log("Extra Videos:", JSON.stringify(mesaRedonda.extraVideos, null, 2));

    } catch (error) {
        console.error("Error:", error);
    }
}

debugMesaRedonda();
