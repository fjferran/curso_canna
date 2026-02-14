
import fs from 'fs';
import path from 'path';

// Load env before importing anything that uses it
try {
    const envPath = path.resolve(__dirname, '.env.local');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^"(.*)"$/, '$1');
                process.env[key] = value;
            }
        });
    }
} catch (e) {
    console.error("Error loading .env.local", e);
}

import { getCalendarEvents } from './lib/calendar_debug';


async function run() {
    console.log("Fetching events for Feb 14...");
    const events = await getCalendarEvents();

    // Filter for events on Feb 14
    const targetDate = '2026-02-14';
    const todaysEvents = events.filter(e => e.start.startsWith(targetDate));

    console.log(`Found ${todaysEvents.length} events for ${targetDate}.`);

    todaysEvents.forEach(e => {
        console.log('---------------------------------------------------');
        console.log(`ID: ${e.id}`);
        console.log(`Title: ${e.title}`);
        console.log(`Description Snippet: ${e.description.substring(0, 200)}...`);
        console.log(`Video Link: ${e.videoLink}`);
        console.log(`PDF Link: ${e.pdfLink}`);
        console.log(`All Extra Videos: ${e.extraVideos.join(', ')}`);
        console.log(`Is Expert: ${e.isExpertVideo}`);

        // Match links manually to see what usually matches
        const urlRegex = /https?:\/\/[^\s"'<>\]\[]+[^\s"<>\]\[.,;?]/g;
        const links = e.description.match(urlRegex) || [];
        console.log("Raw Description Links:");
        links.forEach(l => console.log(` - ${l}`));
    });
}

run();
