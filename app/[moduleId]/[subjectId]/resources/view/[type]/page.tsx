import Link from "next/link";
import { notFound } from "next/navigation";
import { courses } from "@/lib/data";
import { getSubjectArtifacts } from "@/lib/actions";
import { ArrowLeft, Printer, Share2, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import Markdown from 'react-markdown';

// We'll use a server action to get the content
// In a real app, this would fetch from the artifact storage
import { getArtifactContent } from "@/lib/actions";

interface PageProps {
    params: Promise<{
        moduleId: string;
        subjectId: string;
        type: string; // 'briefing' | 'studyGuide'
    }>;
}

export function generateStaticParams() {
    const params = [];
    for (const course of courses) {
        for (const subject of course.subjects) {
            params.push({ moduleId: course.id, subjectId: subject.id, type: 'briefing' });
            params.push({ moduleId: course.id, subjectId: subject.id, type: 'studyGuide' });
        }
    }
    return params;
}

export default async function ArtifactViewerPage({ params }: PageProps) {
    const { moduleId, subjectId, type } = await params;
    const course = courses.find((c) => c.id === moduleId);
    const subject = course?.subjects.find((s) => s.id === subjectId);

    if (!course || !subject || (type !== 'briefing' && type !== 'studyGuide')) {
        notFound();
    }

    const artifacts = await getSubjectArtifacts(subjectId);

    // safe type casting for key access
    const artifactKey = type as 'briefing' | 'studyGuide';
    const artifact = artifacts?.[artifactKey];

    if (!artifact) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Recurso no encontrado. Asegúrate de que se ha generado.</p>
            </div>
        );
    }

    // Fetch the content (Simulated extraction)
    const content = await getArtifactContent(subject.id, type);

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 leading-relaxed">
            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-4 md:px-8 flex justify-between items-center">
                <Link
                    href={`/${moduleId}/${subjectId}/resources`}
                    className="inline-flex items-center text-slate-600 hover:text-emerald-700 transition-colors font-medium"
                >
                    <ArrowLeft size={18} className="mr-2" />
                    Volver a Recursos
                </Link>

                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Printer size={16} className="mr-2" />
                        Imprimir
                    </Button>
                </div>
            </div>

            <main className="max-w-3xl mx-auto py-12 px-6 md:px-0">
                <header className="mb-10 border-b border-emerald-100 pb-8">
                    <div className="uppercase tracking-wide text-xs font-bold text-emerald-600 mb-2">
                        {type === 'briefing' ? 'Informe Ejecutivo' : 'Guía de Estudio'}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 text-balance">
                        {artifact.title}
                    </h1>

                </header>

                <article className="prose prose-slate prose-lg max-w-none prose-headings:text-emerald-950 prose-a:text-emerald-600">
                    {/* Render actual markdown content */}
                    <div className="whitespace-pre-wrap">
                        {content ? (
                            <Markdown>{content}</Markdown>
                        ) : (
                            <div className="py-20 text-center text-slate-400">
                                <p>Cargando contenido del informe...</p>
                            </div>
                        )}
                    </div>
                </article>

                {/* Bibliography Section */}
                {artifacts?.sources && artifacts.sources.length > 0 && (
                    <div className="mt-16 pt-10 border-t border-slate-200">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Fuentes y Referencias</h2>
                        <ul className="space-y-4">
                            {artifacts.sources.map((source, index) => {
                                const isUrl = source.description.startsWith("http");
                                return (
                                    <li key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-semibold text-slate-800 text-lg">
                                                [{index + 1}] {source.title}
                                            </span>
                                            <span className="text-slate-600 text-sm">{source.author}</span>
                                            {isUrl && (
                                                <a
                                                    href={source.description}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-emerald-600 hover:text-emerald-700 text-sm mt-1 truncate block hover:underline"
                                                >
                                                    {source.description}
                                                </a>
                                            )}
                                            {!isUrl && source.description && (
                                                <p className="text-slate-500 text-sm mt-1">{source.description}</p>
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </main>
        </div>
    );
}
