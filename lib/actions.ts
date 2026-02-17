"use server";

import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { revalidatePath, revalidateTag } from "next/cache";

const execPromise = promisify(exec);

const ARTIFACTS_FILE = path.join(process.cwd(), "lib", "artifacts.json");

export interface Artifact {
    id: string;
    title: string;
    subtitle?: string; // One-sentence description
    type: "report" | "video" | "data_table" | "slide_deck";
    content?: string; // Markdown content
    status: "in_progress" | "completed";
}

export interface Source {
    title: string;
    author: string;
    description: string;
}

export interface SubjectArtifacts {
    subjectId: string;
    notebookId: string;
    briefing?: Artifact;
    studyGuide?: Artifact;
    table?: Artifact;
    video?: Artifact; // Deprecated - replaced by videos
    slideDeck?: Artifact; // Deprecated - replaced by slideDecks
    videos?: Artifact[];
    slideDecks?: Artifact[];
    sources?: Source[];
}

export async function getSubjectArtifacts(subjectId: string): Promise<SubjectArtifacts | null> {
    try {
        console.log(`[Debug] Reading artifacts for subject: ${subjectId}`);
        const data = await fs.readFile(ARTIFACTS_FILE, "utf-8");
        const artifactsStore = JSON.parse(data);
        const artifact = artifactsStore[subjectId];
        console.log(`[Debug] Artifact found for ${subjectId}:`, artifact ? "YES" : "NO");
        if (!artifact) {
            console.log(`[Debug] Available keys:`, Object.keys(artifactsStore).join(", "));
        }
        return artifact || null;
    } catch (error) {
        console.error(`[Debug] Error reading artifacts file at ${ARTIFACTS_FILE}:`, error);
        return null;
    }
}

export async function getArtifactContent(subjectId: string, type: string): Promise<string | null> {
    try {
        const data = await fs.readFile(ARTIFACTS_FILE, "utf-8");
        const artifactsStore = JSON.parse(data);
        const subject = artifactsStore[subjectId];

        if (!subject) return null;

        // type is 'briefing' or 'studyGuide'
        const artifact = subject[type];

        if (artifact && artifact.content) {
            return artifact.content;
        }

        return "El contenido se está extrayendo. Por favor recarga la página en unos momentos.";
    } catch (error) {
        return null;
    }
}

export async function syncArtifacts(subjectId?: string) {
    try {
        console.log("Starting manual artifact sync...");
        // Revalidate calendar tags as well
        // @ts-ignore
        revalidateTag('calendar');

        // Run the master script that calls sync and download
        const { stdout, stderr } = await execPromise("python3 fetch_media.py");
        console.log("Sync output:", stdout);
        if (stderr) console.error("Sync errors:", stderr);

        // Revalidate everything to ensure fresh data
        // @ts-ignore
        revalidateTag('calendar');
        if (subjectId) {
            revalidatePath(`/[moduleId]/${subjectId}/resources`, 'page');
        } else {
            revalidatePath("/", 'layout');
        }

        return { success: true, message: "Sincronización completada. El calendario y los recursos se han actualizado." };
    } catch (error: any) {
        console.error("Failed to sync artifacts:", error);
        return { success: false, message: `Error en la sincronización: ${error.message}` };
    }
}

export async function revalidateCalendar() {
    // @ts-ignore
    revalidateTag('calendar');
    revalidatePath("/", "layout");
    return { success: true, message: "Calendario actualizado." };
}
