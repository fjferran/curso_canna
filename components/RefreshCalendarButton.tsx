
"use client";

import { useState } from "react";
import { RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { revalidateCalendar } from "@/lib/actions";

export default function RefreshCalendarButton() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleRefresh = async () => {
        setStatus("loading");
        try {
            const result = await revalidateCalendar();
            if (result.success) {
                setStatus("success");
                setTimeout(() => {
                    setStatus("idle");
                    window.location.reload();
                }, 2000);
            } else {
                setStatus("error");
            }
        } catch (error) {
            setStatus("error");
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={status === "loading"}
            className={`h-8 px-2 text-white bg-red-500 hover:bg-red-600 border border-red-700 ${status === "loading" ? "animate-spin" : ""
                }`}
            title="Refrescar Calendario"
        >
            {status === "success" ? (
                <CheckCircle2 size={16} />
            ) : (
                <RefreshCw size={16} className={status === "loading" ? "animate-spin" : ""} />
            )}
        </Button>
    );
}
