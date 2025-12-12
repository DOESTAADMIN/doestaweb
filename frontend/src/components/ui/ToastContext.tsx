"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { FaCheckCircle, FaExclamationCircle, FaTimes } from "react-icons/fa";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    addToast: (message: string, type: ToastType) => void;
    success: (message: string) => void;
    error: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const addToast = useCallback((message: string, type: ToastType) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 3000); // Auto dismiss
    }, [removeToast]);

    const success = useCallback((msg: string) => addToast(msg, "success"), [addToast]);
    const error = useCallback((msg: string) => addToast(msg, "error"), [addToast]);

    return (
        <ToastContext.Provider value={{ addToast, success, error }}>
            {children}
            <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded shadow-lg text-white text-sm font-medium min-w-[300px] animate-in slide-in-from-right-full transition-all",
                            t.type === "success" && "bg-green-600",
                            t.type === "error" && "bg-red-600",
                            t.type === "info" && "bg-blue-600"
                        )}
                    >
                        {t.type === "success" && <FaCheckCircle size={18} />}
                        {t.type === "error" && <FaExclamationCircle size={18} />}
                        <span className="flex-1">{t.message}</span>
                        <button onClick={() => removeToast(t.id)} className="hover:opacity-80">
                            <FaTimes />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
