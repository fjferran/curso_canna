import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PoliticaPrivacidad() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
            <header className="bg-emerald-900 text-white py-8 px-4 md:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-4">
                        <Link
                            href="/"
                            className="inline-flex items-center text-emerald-300 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={16} className="mr-2" />
                            Volver al inicio
                        </Link>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Política de Privacidad y Cookies</h1>
                </div>
            </header>
            <main className="flex-grow py-12 px-4 md:px-8">
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200 prose prose-slate max-w-none">
                    <h3>Uso de Cookies y Privacidad</h3>
                    <p>
                        Esta plataforma de formación, de acceso restringido y exclusivo para alumnos matriculados, únicamente utiliza <strong>cookies de sesión estrictamente técnicas y necesarias</strong> para el funcionamiento del sistema de inicio de sesión mediante autenticación segura con Google (NextAuth).
                    </p>
                    <p>
                        Estas cookies son esenciales para permitirle acceder a su cuenta, mantener su sesión activa mientras navega por los diferentes módulos del curso y garantizar la seguridad de su conexión.
                    </p>
                    <p>
                        En cumplimiento de la Directiva sobre la privacidad y las comunicaciones electrónicas de la Unión Europea y las directrices de la Agencia Española de Protección de Datos (AEPD), al ser cookies de índole puramente técnica y estrictamente necesarias para prestar el servicio educativo solicitado por el usuario, <strong>están exentas de la obligación de recabar consentimiento expreso</strong>.
                    </p>
                    <h3>Información adicional</h3>
                    <ul>
                        <li>No utilizamos ningún tipo de herramienta de analítica web (como Google Analytics) que rastree su comportamiento.</li>
                        <li>No utilizamos cookies publicitarias ni compartimos su información de navegación con terceros o redes sociales con fines de marketing.</li>
                        <li>El único dato personal gestionado por la plataforma es su dirección de correo electrónico, empleada exclusivamente como identificador para validar su derecho de acceso a los contenidos docentes adquiridos.</li>
                    </ul>
                </div>
            </main>
            <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
                <p>© {new Date().getFullYear()} Formación Industria y Agronomía Digital</p>
            </footer>
        </div>
    );
}
