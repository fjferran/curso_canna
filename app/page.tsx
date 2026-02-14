import Link from "next/link";
import { courses } from "@/lib/data";
import { ArrowRight, BookOpen, GraduationCap, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Hero Section */}
      <header className="relative bg-emerald-900 text-white py-24 px-4 md:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight max-w-4xl">
            Industria y Agronomía Digital del Cannabis
          </h1>
          <p className="text-xl md:text-2xl text-emerald-100 max-w-3xl mb-12">
            Plataforma de formación avanzada en tecnologías, normativa y negocio del sector del cannabis.
          </p>
          <div className="h-4"></div>
        </div>
      </header>

      {/* Modules Grid */}
      <main className="flex-grow py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">
            Módulos Formativos
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {courses.map((course) => (
              <Card key={course.id} className="border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                      {course.code}
                    </span>
                    <BookOpen className="text-emerald-600" size={24} />
                  </div>
                  <CardTitle className="text-2xl text-emerald-950 mb-2">
                    {course.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-base text-slate-600">
                    {course.description}
                  </CardDescription>
                  <ul className="mt-6 space-y-2">
                    {course.subjects.slice(0, 3).map((sub) => (
                      <li key={sub.id} className="flex items-start text-sm text-slate-500">
                        <span className="mr-2 text-emerald-400">•</span>
                        {sub.title}
                      </li>
                    ))}
                    {course.subjects.length > 3 && (
                      <li className="text-xs text-slate-400 italic pl-4">
                        + {course.subjects.length - 3} asignaturas más...
                      </li>
                    )}
                  </ul>
                </CardContent>
                <CardFooter className="pt-6 border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
                  <Link
                    href={`/${course.id}`}
                    className="w-full inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 group"
                  >
                    Acceder al Módulo
                    <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
        <p>© 2026 Universidad de Alicante - Título de Experto Universitario</p>
      </footer>
    </div>
  );
}
