import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { Calendar, User, GraduationCap, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

export const dynamic = "force-dynamic";

export default async function ExpertPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const expertosDir = path.join(process.cwd(), "expertos");
    const cvPath = path.join(expertosDir, slug, "cv.md");

    if (!fs.existsSync(cvPath)) {
        notFound();
    }

    const content = fs.readFileSync(cvPath, "utf8");

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Header */}
            <div className="bg-emerald-950 text-white py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <Link href="/" className="inline-flex items-center text-emerald-400 hover:text-emerald-300 mb-6 transition-colors">
                        <ArrowLeft size={20} className="mr-2" />
                        Volver a los Módulos
                    </Link>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-emerald-800/50 p-3 rounded-2xl border border-emerald-700">
                            <GraduationCap className="text-emerald-400" size={32} />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold">Perfil del Docente</h1>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto py-12 px-6">
                <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-10 -mt-10 opacity-50"></div>

                    <div className="relative z-10 prose prose-slate prose-emerald max-w-none prose-lg">
                        <ReactMarkdown>
                            {content}
                        </ReactMarkdown>
                    </div>
                </div>

                <div className="mt-12 flex justify-center">
                    <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 h-14 px-8 text-lg rounded-2xl shadow-lg shadow-emerald-200">
                        <Link href="/">
                            <ArrowLeft size={20} className="mr-2" />
                            Explorar otros Módulos
                        </Link>
                    </Button>
                </div>
            </main>
        </div>
    );
}
