
import Link from "next/link";
import { notFound } from "next/navigation";
import { courses } from "@/lib/data";
import { ArrowLeft, FileText, BookOpen, Play, Table as TableIcon, RefreshCw, Bot, Presentation, ScrollText, Download, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSubjectArtifacts } from "@/lib/actions";
import SourceDownloader from "@/components/SourceDownloader";
import RoleGuard from "@/components/RoleGuard";
import SessionSection from "@/components/SessionSection";
import RefreshButton from "@/components/RefreshButton";
import { getCalendarEvents } from "@/lib/calendar";

// Force dynamic rendering to ensure calendar events are always fresh
export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{
        moduleId: string;
        subjectId: string;
    }>;
}

export function generateStaticParams() {
    const params = [];
    for (const course of courses) {
        for (const subject of course.subjects) {
            params.push({
                moduleId: course.id,
                subjectId: subject.id,
            });
        }
    }
    return params;
}

export default async function ResourcesPage({ params }: PageProps) {
    const { moduleId, subjectId } = await params;
    const course = courses.find((c) => c.id === moduleId);
    const subject = course?.subjects.find((s) => s.id === subjectId);

    if (!course || !subject) {
        notFound();
    }

    const artifacts = await getSubjectArtifacts(subjectId);

    // Fetch and filter calendar events for this subject
    const allSessions = await getCalendarEvents();
    const subjectSessions = allSessions.filter(s => {
        const titleLower = s.title.toLowerCase();
        const searchStr = (s.title + " " + s.description).toLowerCase();
        const idLower = subjectId.toLowerCase();

        // 1. Direct ID match
        let isMatch = searchStr.includes(idLower);

        // 2. Keyword match if no other direct ID is present
        if (!isMatch) {
            const otherSubjectPattern = /gm\d{2}-\d/g;
            const matches = titleLower.match(otherSubjectPattern);
            // If it has a different subject ID, it's not for this subject
            if (!matches || matches.includes(idLower)) {
                const stopWords = ['de', 'la', 'en', 'el', 'al', 'del', 'los', 'las', 'un', 'una'];
                const keywords = subject.title.toLowerCase()
                    .split(/[\s,.-]+/)
                    .filter(word => word.length > 3 && !stopWords.includes(word));

                if (keywords.some(kw => searchStr.includes(kw))) {
                    isMatch = true;
                }
            }
        }

        return isMatch;
    });

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
            {/* Header */}
            <header className="bg-emerald-900 text-white py-8 px-4 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-4">
                        <Link
                            href={`/${moduleId}`}
                            className="inline-flex items-center text-emerald-300 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={16} className="mr-2" />
                            Volver a {course.title}
                        </Link>
                    </div>
                    <div className="flex justify-between items-start" suppressHydrationWarning>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                                Recursos: {subject.title}
                            </h1>
                            <p className="mt-2 text-emerald-100 max-w-3xl text-sm md:text-base">
                                Materiales educativos avanzados basados en fuentes académicas y científicas validadas.
                            </p>
                        </div>
                        <div>
                            <RoleGuard adminOnly>
                                <RefreshButton subjectId={subjectId} />
                            </RoleGuard>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-grow py-8 px-4 md:px-8">
                <div className="max-w-6xl mx-auto space-y-16">

                    {!artifacts ? (
                        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-200">
                            <RefreshCw className="mx-auto h-12 w-12 text-slate-300 animate-spin mb-4" />
                            <h3 className="text-lg font-medium text-slate-900">Generando Contenidos...</h3>
                            <p className="text-slate-500 mt-2 max-w-md mx-auto">
                                El sistema está recopilando y procesando los materiales para esta asignatura.
                                <br />Vuelve en unos minutos.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* 2. Presentaciones */}
                            {artifacts.slideDecks && artifacts.slideDecks.length > 0 && (
                                <section id="presentaciones">
                                    <div className="flex items-center mb-8">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mr-4">
                                            <Presentation className="text-emerald-200" size={28} />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-slate-900">Presentaciones de Introducción</h2>
                                            <p className="text-slate-500 text-lg">Material visual estructurado para revisión rápida.</p>
                                        </div>
                                    </div>
                                    <div className="rounded-xl border shadow-lg bg-white overflow-hidden border-t-8 border-t-emerald-200">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
                                            {artifacts.slideDecks.map((slides, index) => (
                                                <div key={slides.id || `slide-${index}`} className="p-8 border-2 border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-emerald-50/20 transition-all flex flex-col h-full hover:shadow-md">
                                                    <h3 className="font-black text-slate-900 text-xl md:text-2xl mb-4 leading-tight">{slides.title || `Presentación ${index + 1}`}</h3>
                                                    <p className="text-base text-slate-600 mb-8 line-clamp-3 leading-relaxed">{slides.subtitle || "Presentación detallada sobre los conceptos del módulo."}</p>
                                                    {slides.status === 'completed' ? (
                                                        <a
                                                            href={slides.content}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="mt-auto w-full bg-emerald-200 hover:bg-emerald-300 text-emerald-950 font-black h-14 text-lg shadow-lg shadow-emerald-100/50 rounded-lg flex items-center justify-center transition-colors"
                                                        >
                                                            Ver Presentación
                                                        </a>
                                                    ) : (
                                                        <div className="mt-auto w-full bg-emerald-50 text-emerald-200 h-14 rounded-lg flex items-center justify-center cursor-not-allowed">
                                                            Generando...
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* 3. Vídeos */}
                            {artifacts.videos && artifacts.videos.length > 0 && (
                                <section id="videos">
                                    <div className="flex items-center mb-8">
                                        <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center mr-4">
                                            <Play className="text-sky-500" size={28} />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-slate-900">Vídeos de Introducción</h2>
                                            <p className="text-slate-500 text-lg">Explicaciones audiovisuales y recorridos temáticos.</p>
                                        </div>
                                    </div>
                                    <div className="rounded-xl border shadow-lg bg-white overflow-hidden border-t-8 border-t-sky-500">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
                                            {artifacts.videos.map((video, index) => (
                                                <div key={video.id || `vid-${index}`} className="flex items-center p-6 border-2 border-slate-100 rounded-2xl bg-white hover:border-sky-100 hover:bg-sky-50/20 transition-all group shadow-sm hover:shadow-md">
                                                    <div className="w-20 h-14 bg-slate-50 rounded-xl flex-shrink-0 flex items-center justify-center mr-6 border-2 border-slate-100 group-hover:bg-sky-50 group-hover:border-sky-100 transition-colors">
                                                        <Play size={24} className="text-sky-500" />
                                                    </div>
                                                    <div className="flex-grow min-w-0 mr-6">
                                                        <h3 className="font-black text-slate-900 text-lg md:text-xl truncate mb-1">{video.title || `Video ${index + 1}`}</h3>
                                                        <p className="text-xs text-slate-400 uppercase tracking-tighter font-black mt-0.5">
                                                            {video.status === 'completed' ? 'CONTENIDO DISPONIBLE' : 'SINCRONIZANDO...'}
                                                        </p>
                                                    </div>
                                                    {video.status === 'completed' && video.content ? (
                                                        <a
                                                            href={video.content}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex-shrink-0 bg-sky-500 hover:bg-sky-600 text-white px-8 h-12 text-lg font-bold shadow-lg shadow-sky-100 rounded-lg flex items-center justify-center transition-colors"
                                                        >
                                                            Ver
                                                        </a>
                                                    ) : (
                                                        <div className="text-sm text-slate-400 font-mono italic font-bold">
                                                            {video.status === 'in_progress' ? 'Sinc...' : 'N/D'}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* 4. Guías y Materiales */}
                            {(artifacts.studyGuide || artifacts.table) && (
                                <section id="guias">
                                    <div className="flex items-center mb-8">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mr-4">
                                            <BookOpen className="text-emerald-600" size={28} />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-slate-900">Guías y Materiales</h2>
                                            <p className="text-slate-500 text-lg">Conceptos clave, tablas de datos y herramientas de estudio.</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {artifacts.studyGuide && (
                                            <div className="rounded-xl border shadow-lg bg-white overflow-hidden border-t-8 border-t-amber-500 hover:shadow-xl transition-all">
                                                <div className="p-8 pb-4">
                                                    <h3 className="text-2xl font-bold text-slate-900">{artifacts.studyGuide.title}</h3>
                                                    <p className="text-lg mt-2 text-slate-600">{artifacts.studyGuide.subtitle || "Guía de aprendizaje detallada con conceptos clave."}</p>
                                                </div>
                                                <div className="p-8 pt-0">
                                                    <div className="bg-slate-50 p-4 rounded-lg text-xs text-slate-500 mb-6 font-mono border border-slate-100">
                                                        ID: {artifacts.studyGuide.id.substring(0, 12)}... | ESTADO: {artifacts.studyGuide.status === 'completed' ? 'LISTO' : 'GENERANDO...'}
                                                    </div>
                                                    <Link
                                                        href={`/${moduleId}/${subjectId}/resources/view/studyGuide`}
                                                        className={`w-full h-14 text-lg font-bold shadow-lg shadow-amber-100 rounded-lg flex items-center justify-center transition-colors ${artifacts.studyGuide.status === 'completed' ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-amber-100 text-amber-400 cursor-not-allowed pointer-events-none'}`}
                                                    >
                                                        Iniciar Estudio
                                                    </Link>
                                                </div>
                                            </div>
                                        )}

                                        {artifacts.table && (
                                            <div className="rounded-xl border shadow-lg bg-white overflow-hidden border-t-8 border-t-purple-500 hover:shadow-xl transition-all">
                                                <div className="p-8 pb-4">
                                                    <h3 className="text-2xl font-bold text-slate-900">{artifacts.table.title}</h3>
                                                    <p className="text-lg mt-2 text-slate-600">Datos estructurados y estadísticas del sector.</p>
                                                </div>
                                                <div className="p-8 pt-0">
                                                    <div className="bg-slate-50 p-4 rounded-lg text-xs text-slate-500 mb-6 font-mono border border-slate-100">
                                                        ID: {artifacts.table.id.substring(0, 12)}... | ESTADO: {artifacts.table.status === 'completed' ? 'LISTO' : 'GENERANDO...'}
                                                    </div>
                                                    <button
                                                        className={`w-full h-14 text-lg font-bold shadow-lg shadow-purple-100 rounded-lg flex items-center justify-center transition-colors ${artifacts.table.status === 'completed' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-purple-100 text-purple-400 cursor-not-allowed'}`}
                                                        disabled={artifacts.table.status !== 'completed'}
                                                    >
                                                        Explorar Datos
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            )}

                            {/* 5. Sessions and Recordings */}
                            <SessionSection sessions={subjectSessions} />

                            {/* 6. Bibliography Section */}
                            {artifacts.sources && artifacts.sources.length > 0 && (
                                <section id="bibliografia" className="pt-12 border-t-4 border-slate-200">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mr-4">
                                                <ScrollText className="text-slate-600" size={28} />
                                            </div>
                                            <div>
                                                <h2 className="text-3xl font-black text-slate-900">Bibliografía Base</h2>
                                                <p className="text-slate-500 text-lg">Fuentes científicas y académicas vinculadas a la asignatura.</p>
                                            </div>
                                        </div>
                                        <SourceDownloader sources={artifacts.sources} fileName={`bibliografia-${subjectId}.csv`} />
                                    </div>
                                    <div className="rounded-xl border-2 border-slate-200 shadow-lg bg-white overflow-hidden">
                                        <ul suppressHydrationWarning className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-x divide-y divide-slate-100 bg-slate-50/50">
                                            {artifacts.sources.map((src, idx) => (
                                                <li key={idx} className="p-8 hover:bg-emerald-50/30 transition-all group relative list-none">
                                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <ExternalLink size={16} className="text-emerald-600" />
                                                    </div>
                                                    <h4 className="text-lg font-black text-slate-900 line-clamp-2 leading-tight group-hover:text-emerald-700 transition-colors mb-4">{src.title}</h4>
                                                    <p className="text-xs text-slate-400 uppercase tracking-widest font-black mb-4">{src.author}</p>
                                                    <a
                                                        href={src.description}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-emerald-600 hover:text-emerald-700 font-bold block truncate italic"
                                                    >
                                                        {src.description}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </section>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
