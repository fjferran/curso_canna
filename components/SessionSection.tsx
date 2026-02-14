
import { CalendarEvent } from "@/lib/calendar";
import { Calendar, Video, PlayCircle, Clock, FileVideo, ExternalLink, FileText, GraduationCap } from "lucide-react";
import Link from "next/link";
import RefreshCalendarButton from "./RefreshCalendarButton";
import RoleGuard from "./RoleGuard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface SessionSectionProps {
    sessions: CalendarEvent[];
    title?: string;
}

export default function SessionSection({ sessions, title = "Sesiones y Grabaciones" }: SessionSectionProps) {
    if (sessions.length === 0) return null;



    return (
        <section className="mt-12">
            <div className="flex items-center justify-between gap-2 mb-6">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-1 bg-emerald-500 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
                </div>
                <RoleGuard adminOnly>
                    <RefreshCalendarButton />
                </RoleGuard>
            </div>

            <div className="grid gap-6">
                {sessions.map((session) => (
                    <Card key={session.id} className="overflow-hidden border-slate-200 hover:border-emerald-200 transition-colors">
                        <div className="flex flex-col md:flex-row">
                            {/* Date Column */}
                            <div className={`p-6 flex flex-col items-center justify-center text-center min-w-[120px] ${session.type === 'past' ? 'bg-slate-50' : 'bg-emerald-50'}`}>
                                <span suppressHydrationWarning className={`text-xs font-bold uppercase tracking-wider ${session.type === 'past' ? 'text-slate-500' : 'text-emerald-700'}`}>
                                    {new Date(session.start).toLocaleDateString('es-ES', { month: 'short', timeZone: 'Europe/Madrid' })}
                                </span>
                                <span className={`text-3xl font-black ${session.type === 'past' ? 'text-slate-700' : 'text-emerald-900'}`}>
                                    {new Date(session.start).getDate()}
                                </span>
                                <span suppressHydrationWarning className={`text-xs font-medium ${session.type === 'past' ? 'text-slate-400' : 'text-emerald-600'}`}>
                                    {new Date(session.start).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid' })}
                                </span>
                            </div>

                            {/* Content Column */}
                            <div className="flex-grow p-6 flex flex-col">
                                <CardTitle className="text-xl mb-4 text-slate-900 leading-tight">
                                    {session.title}
                                </CardTitle>

                                <CardDescription className="text-slate-600 line-clamp-2 mb-6">
                                    {session.description.split('http')[0].replace(/(?:Profesor|Ponente|Docente|Instructor|Experto):\s*[^\n#<|]+/i, '').trim()}
                                </CardDescription>

                                {/* Metadata Grid */}
                                <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                                    {/* Left: Video & Content Actions (Stacked & Large) */}
                                    <div className="flex flex-col gap-2.5 shrink-0 w-full sm:w-auto">
                                        {session.videoLink ? (
                                            <a href={session.videoLink} target="_blank" rel="noopener noreferrer" className="w-full">
                                                <Button size="lg" className={`w-full sm:w-56 font-black h-12 px-6 text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all ${session.videoType === 'class'
                                                    ? 'bg-violet-600 hover:bg-violet-700 text-white'
                                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                                    }`}>
                                                    <PlayCircle size={20} className="mr-3" />
                                                    {session.videoType === 'class' ? 'Video de Clase' : 'Video previo'}
                                                </Button>
                                            </a>
                                        ) : session.type === 'future' && (
                                            <div className="flex items-center text-xs text-slate-400 font-bold italic h-12 px-4 bg-slate-50 rounded-lg border border-slate-100 w-full sm:w-56">
                                                <Video size={18} className="mr-3" />
                                                Se grabará
                                            </div>
                                        )}

                                        {session.extraVideos && session.extraVideos.length > 0 && session.extraVideos.map((video, idx) => (
                                            <a key={idx} href={video.url} target="_blank" rel="noopener noreferrer" className="w-full">
                                                <Button size="sm" variant={video.type === 'preview' ? "outline" : "default"} className={`w-full sm:w-56 h-9 px-4 text-xs font-bold uppercase tracking-wider ${video.type === 'class'
                                                    ? 'bg-violet-600 hover:bg-violet-700 text-white border-0'
                                                    : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                                                    }`}>
                                                    <Video size={14} className="mr-2" />
                                                    {video.type === 'class' ? `Video de Clase ${idx + 2}` : `Video previo ${idx + 1}`}
                                                </Button>
                                            </a>
                                        ))}

                                        {session.pdfLink && (
                                            <a href={session.pdfLink} target="_blank" rel="noopener noreferrer" className="w-full">
                                                <Button size="lg" variant="outline" className="w-full sm:w-56 border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-black h-12 px-6 text-sm uppercase tracking-wider shadow-sm hover:shadow-md transition-all">
                                                    {session.pdfLink.toLowerCase().match(/\.(zip|rar|7z|tar|gz)$/) ? 'Descargar Ficheros' : 'Contenidos Docentes'}
                                                </Button>
                                            </a>
                                        )}
                                    </div>

                                    {/* Right: Professor & Type Info */}
                                    <div className="flex flex-col gap-2 items-start sm:items-end min-w-0 flex-1 text-left sm:text-right">
                                        {session.professorName && (
                                            <Link
                                                href={`/expertos/${session.professorId || '#'}`}
                                                className="text-xs font-black text-emerald-800 uppercase tracking-widest hover:text-emerald-600 transition-colors flex items-center gap-2 truncate text-sm"
                                            >
                                                <GraduationCap size={16} className="text-emerald-500 shrink-0" />
                                                {session.professorName}
                                            </Link>
                                        )}
                                        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
                                            <div className={`inline-flex text-xs font-bold px-3 py-1.5 rounded-full items-center gap-2 w-fit ${session.type === 'future' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                                {session.type === 'future' ? <Clock size={14} /> : <FileVideo size={14} />}
                                                <span className="uppercase tracking-wide">
                                                    {session.sessionType || (session.type === 'future' ? 'En Vivo' : 'Grabación')}
                                                </span>
                                            </div>

                                            {(session.type === 'future' || session.meetLink) && (
                                                <a
                                                    href={session.meetLink || "https://meet.google.com"}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex text-xs font-bold px-3 py-1.5 rounded-full items-center gap-2 w-fit bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors border border-blue-200"
                                                >
                                                    <ExternalLink size={14} />
                                                    <span className="uppercase tracking-wide">Unirse a Sesión</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </section >
    );
}
