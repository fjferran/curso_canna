import Link from "next/link";
import { notFound } from "next/navigation";
import { courses } from "@/lib/data";
import { ArrowLeft, Book, ExternalLink, Bot, BookOpen, Lightbulb, FileText, Presentation, Layout, HelpCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PageProps {
    params: Promise<{
        moduleId: string;
    }>;
}

export function generateStaticParams() {
    return courses.map((course) => ({
        moduleId: course.id,
    }));
}

export default async function ModulePage({ params }: PageProps) {
    const { moduleId } = await params;
    const course = courses.find((c) => c.id === moduleId);

    if (!course) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
            <div className="bg-emerald-900 text-white py-12 px-4 md:px-8">
                <div className="max-w-5xl mx-auto">
                    <Link
                        href="/"
                        className="inline-flex items-center text-emerald-300 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        Volver al inicio
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <span className="inline-block bg-emerald-800 text-emerald-200 text-sm font-bold px-3 py-1 rounded-full mb-3">
                                {course.code}
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
                                {course.title}
                            </h1>
                            <p className="mt-6 text-emerald-100 max-w-3xl text-xl md:text-2xl leading-relaxed">
                                {course.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="flex-grow py-12 px-4 md:px-8">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold text-slate-800 mb-8 border-b border-emerald-200 pb-2">
                        Asignaturas y Contenidos
                    </h2>

                    {/* Seguimiento y Evaluación */}
                    <section className="mb-16">
                        <div className="flex items-center mb-8 text-indigo-900">
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mr-4">
                                <BookOpen className="text-indigo-600" size={28} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-slate-900">Seguimiento y Evaluación</h2>
                                <p className="text-slate-500 text-lg">Guía para el registro de evidencias y evaluación del curso.</p>
                            </div>
                        </div>
                        <Card className="border-t-8 border-t-indigo-600 shadow-xl bg-white overflow-hidden">
                            <CardContent className="p-8">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                    {/* Requerimientos */}
                                    <div className="space-y-6">
                                        <div className="flex items-center space-x-3 text-indigo-600">
                                            <Lightbulb size={24} />
                                            <h3 className="text-xl font-black uppercase tracking-tight">Tu Cuaderno de Evidencias</h3>
                                        </div>
                                        <p className="text-slate-600 leading-relaxed text-lg">
                                            Para cada asignatura, deberás construir un cuaderno personal en <strong className="text-indigo-900">NotebookLM</strong> que servirá como evidencia de tu aprendizaje. Este cuaderno es individual y se elabora durante el seguimiento del curso.
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start space-x-4 shadow-sm hover:shadow-md transition-all hover:border-indigo-100 group">
                                                <FileText className="text-indigo-500 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" size={24} />
                                                <div>
                                                    <span className="block font-black text-slate-900 text-lg">Informe</span>
                                                    <span className="text-xs text-slate-400 uppercase font-black tracking-widest">Contenidos Expertos</span>
                                                </div>
                                            </div>
                                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start space-x-4 shadow-sm hover:shadow-md transition-all hover:border-indigo-100 group">
                                                <Presentation className="text-indigo-500 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" size={24} />
                                                <div>
                                                    <span className="block font-black text-slate-900 text-lg">Presentación</span>
                                                    <span className="text-xs text-slate-400 uppercase font-black tracking-widest">Estructurada</span>
                                                </div>
                                            </div>
                                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start space-x-4 shadow-sm hover:shadow-md transition-all hover:border-indigo-100 group">
                                                <Layout className="text-indigo-500 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" size={24} />
                                                <div>
                                                    <span className="block font-black text-slate-900 text-lg">Mapa Mental</span>
                                                    <span className="text-xs text-slate-400 uppercase font-black tracking-widest">Conceptual</span>
                                                </div>
                                            </div>
                                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start space-x-4 shadow-sm hover:shadow-md transition-all hover:border-indigo-100 group">
                                                <HelpCircle className="text-indigo-500 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" size={24} />
                                                <div>
                                                    <span className="block font-black text-slate-900 text-lg">Preguntas Clave</span>
                                                    <span className="text-xs text-slate-400 uppercase font-black tracking-widest">Auto-contestadas</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tutorial Paso a Paso */}
                                    <div className="bg-indigo-50/50 rounded-[2rem] p-10 border border-indigo-100 relative overflow-hidden flex flex-col justify-between">
                                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-200/20 rounded-full blur-3xl"></div>
                                        <div>
                                            <h3 className="text-2xl font-black text-indigo-950 mb-8 flex items-center">
                                                <Bot size={28} className="mr-4 text-indigo-600" />
                                                ¿Cómo empezar?
                                            </h3>
                                            <div className="space-y-8">
                                                {[
                                                    { step: "01", text: "Accede a NotebookLM con tu cuenta de Google." },
                                                    { step: "02", text: "Crea un cuaderno para esta asignatura." },
                                                    { step: "03", text: "Sube las presentaciones y vídeos como fuentes." },
                                                    { step: "04", text: "Genera las evidencias solicitadas con la IA." }
                                                ].map((item, i) => (
                                                    <div key={i} className="flex items-center">
                                                        <span className="text-xs font-black bg-indigo-600 text-white rounded-xl w-10 h-8 flex items-center justify-center mr-5 shadow-lg shadow-indigo-100 flex-shrink-0">
                                                            {item.step}
                                                        </span>
                                                        <p className="text-slate-800 font-bold text-lg md:text-xl leading-snug">{item.text}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mt-12">
                                            <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black h-16 rounded-2xl text-xl shadow-xl shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                                <a href="https://notebooklm.google.com/" target="_blank" rel="noopener noreferrer">
                                                    Ir a NotebookLM <ExternalLink size={24} className="ml-3" />
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    <div className="space-y-8">
                        {course.subjects.map((subject, index) => (
                            <Card
                                key={subject.id}
                                className={`border-2 border-slate-200 border-l-[10px] ${index % 2 === 0 ? 'border-l-emerald-600 bg-emerald-50/40' : 'border-l-slate-600 bg-slate-100/60'} hover:shadow-lg transition-all overflow-hidden`}
                            >
                                <div className="flex flex-col md:flex-row">
                                    <div className="flex-grow p-8">
                                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-3 flex items-center">
                                            <Book size={28} className={`${index % 2 === 0 ? 'text-emerald-700' : 'text-slate-700'} mr-3`} />
                                            {subject.title}
                                        </h3>
                                        <p className="text-lg text-slate-700 leading-relaxed font-medium">
                                            {subject.description}
                                        </p>
                                    </div>
                                    <div className={`p-8 border-t md:border-t-0 md:border-l border-slate-200 flex items-center justify-center ${index % 2 === 0 ? 'bg-emerald-100/30' : 'bg-slate-200/30'} md:w-80`}>
                                        <Link
                                            href={`/${moduleId}/${subject.id}/resources`}
                                            className="w-full flex flex-col items-center justify-center text-center p-6 rounded-xl bg-white border-2 border-slate-200 hover:border-emerald-600 hover:bg-emerald-600 hover:text-white transition-all group cursor-pointer shadow-sm"
                                        >
                                            <div className="bg-emerald-100 p-4 rounded-full mb-4 group-hover:bg-white group-hover:scale-110 transition-all">
                                                <Bot className="text-emerald-700" size={28} />
                                            </div>
                                            <span className="font-bold text-lg mb-1">
                                                Ver Recursos
                                            </span>
                                            <span className="text-sm opacity-80 flex items-center group-hover:text-emerald-50 transition-colors">
                                                Informes, Vídeo y Datos <ExternalLink size={12} className="ml-2" />
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>

            <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
                <p>© 2026 Universidad de Alicante</p>
            </footer>
        </div>
    );
}
