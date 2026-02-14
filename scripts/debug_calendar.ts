
import fs from "fs";

const env = fs.readFileSync(".env.local", "utf8");
const API_KEY = env.match(/NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY=(.*)/)?.[1];
const CALENDAR_ID = env.match(/NEXT_PUBLIC_GOOGLE_CALENDAR_ID=(.*)/)?.[1];

async function debugCalendar() {
    if (!API_KEY || !CALENDAR_ID) {
        console.error("Missing API_KEY or CALENDAR_ID");
        return;
    }

    const timeMin = new Date(Date.now() - 86400000 * 180).toISOString();
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?key=${API_KEY}&timeMin=${timeMin}&singleEvents=true&orderBy=startTime`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        const targetEvent = data.items.find((item: any) =>
            item.summary && item.summary.includes("PLANT2CLINIC")
        );

        if (targetEvent) {
            console.log("Found Event:", targetEvent.summary);
            console.log("Raw Description:", JSON.stringify(targetEvent.description, null, 2));
        } else {
            console.log("Event not found. Found titles:", data.items.map((i: any) => i.summary).join(", "));
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

debugCalendar();
