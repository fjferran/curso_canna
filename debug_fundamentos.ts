
import fs from 'fs';
import path from 'path';

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

async function debugFundamentos() {
    console.log("Fetching events for 'Fundamentos'...");
    const events = await getCalendarEvents();

    // Filter for events that likely belong to Fundamentos (GM21-1 or similar title keywords)
    const fundamentosEvents = events.filter(e =>
        e.title.toLowerCase().includes('fundamentos') ||
        e.title.toLowerCase().includes('gm21-1')
    );

    console.log(`Found ${fundamentosEvents.length} events.`);

    fundamentosEvents.forEach(e => {
        console.log('---------------------------------------------------');
        console.log(`ID: ${e.id}`);
        console.log(`Title: ${e.title}`);
        console.log(`Description Snippet: ${e.description.substring(0, 100)}...`);
        console.log(`Video Link: ${e.videoLink}`);
        console.log(`PDF Link: ${e.pdfLink}`);
        console.log(`All Extra Videos: ${e.extraVideos.join(', ')}`);
        console.log(`Is Expert: ${e.isExpertVideo}`);
        console.log(`Raw Description Links:`);
        const urlRegex = /https?:\/\/[^\s"'<>\]\[]+[^\s"<>\]\[.,;?]/g;
        const matches = e.description.match(urlRegex) || [];
        matches.forEach(url => console.log(` - ${url}`));
    });
}

debugFundamentos();
