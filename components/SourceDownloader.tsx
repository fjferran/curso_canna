"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Source } from "@/lib/actions";

interface SourceDownloaderProps {
    sources: Source[];
    fileName?: string;
}

export default function SourceDownloader({ sources, fileName = "bibliografia.csv" }: SourceDownloaderProps) {
    const handleDownload = () => {
        if (!sources || sources.length === 0) return;

        // Create CSV header - Using semicolons for better Excel compatibility in European/Spanish locales
        const headers = ["Título del Documento", "Autor / Organización", "Link / Fuente"];

        // Map data to CSV rows
        const rows = sources.map(source => [
            `"${source.title.replace(/"/g, '""')}"`, // Escape quotes
            `"${source.author.replace(/"/g, '""')}"`,
            `"${source.description.replace(/"/g, '""')}"`
        ]);

        // Combine header and rows using semicolon
        const csvContent = [
            headers.join(";"),
            ...rows.map(r => r.join(";"))
        ].join("\n");

        // Create Blob with UTF-8 BOM for Excel compatibility
        const BOM = "\uFEFF";
        const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Button
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold"
            onClick={handleDownload}
            disabled={!sources || sources.length === 0}
        >
            <Download className="mr-2 h-4 w-4" />
            Descargar Bibliografía (CSV)
        </Button>
    );
}
