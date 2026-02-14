
"use client";

import { useState } from "react";
import { RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { syncArtifacts } from "@/lib/actions";

interface RefreshButtonProps {
    subjectId: string;
}

export default function RefreshButton({ subjectId }: RefreshButtonProps) {
    // Component wrapper to fix hydration issues
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleRefresh = async () => {
        setStatus("loading");
        try {
            const result = await syncArtifacts(subjectId);
            if (result.success) {
                setStatus("success");
                setMessage(result.message);
                // Reset after 3 seconds
                setTimeout(() => {
                    setStatus("idle");
                    // Force a window reload to ensure all RSC data is fresh, 
                    // although revalidatePath is used, client side state might need a nudge
                    window.location.reload();
                }, 3000);
            } else {
                setStatus("error");
                setMessage(result.message);
            }
        } catch (error) {
            setStatus("error");
            setMessage("Error inesperado al sincronizar.");
        }
    };

    return (
        <div className="flex flex-col items-end gap-2">
            <Button
                onClick={handleRefresh}
                disabled={status === "loading"}
                variant={status === "success" ? "outline" : "default"}
                className={`transition-all ${status === "loading" ? "bg-slate-400" :
                    status === "success" ? "border-emerald-500 text-emerald-600" :
                        status === "error" ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"
                    }`}
            >
                {status === "loading" ? (
                    <>
                        <RefreshCw size={16} className="mr-2 animate-spin" />
                        Sincronizando...
                    </>
                ) : status === "success" ? (
                    <>
                        <CheckCircle2 size={16} className="mr-2" />
                        Actualizado
                    </>
                ) : status === "error" ? (
                    <>
                        <AlertCircle size={16} className="mr-2" />
                        Error
                    </>
                ) : (
                    <>
                        <RefreshCw size={16} className="mr-2" />
                        Refrescar Contenidos
                    </>
                )}
            </Button>
            {message && status === "error" && (
                <span className="text-[10px] text-red-500 max-w-[200px] text-right">{message}</span>
            )}
        </div>
    );
}
