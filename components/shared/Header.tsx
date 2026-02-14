import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function Header() {
    return (
        <header className="bg-emerald-900 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center">
                        <img src="/logo.png" alt="IADC Logo" className="h-10 w-auto bg-white p-1 rounded shadow-sm" />
                    </Link>
                    <nav className="flex space-x-4">
                        <Link href="/" className="text-emerald-100 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors">
                            Inicio
                        </Link>
                        <Link href="/gm21" className="text-emerald-100 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors">
                            Módulo Agronómico
                        </Link>
                        <Link href="/gm20" className="text-emerald-100 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors">
                            Módulo Tecnológico
                        </Link>
                        <Link href="/api/auth/signin" className="bg-white text-emerald-900 hover:bg-emerald-100 px-4 py-2 rounded-md text-base font-bold transition-colors ml-4 shadow-sm border border-transparent hover:shadow-md">
                            Iniciar Sesión
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}
