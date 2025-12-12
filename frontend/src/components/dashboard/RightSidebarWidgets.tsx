"use client";

import React from "react";
import { FaCommentDots } from "react-icons/fa";

export default function RightSidebarWidgets() {
    return (
        <div className="space-y-4">
            <CalendarWidget />
            <CurrencyWidget />
            <PansionWidget />
            <ChatButton />
        </div>
    );
}

function CalendarWidget() {
    const today = new Date();
    const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-4 flex flex-col items-center justify-center text-center h-32">
            <div className="text-gray-500 text-sm">{months[today.getMonth()]}</div>
            <div className="text-4xl font-bold text-gray-700 dark:text-gray-200">{today.getDate()}</div>
            <div className="text-gray-400 text-xs">{today.getFullYear()}</div>
        </div>
    );
}

function CurrencyWidget() {
    const [currencies, setCurrencies] = React.useState<any[]>([]);

    React.useEffect(() => {
        // Fetch currencies
        // Assumes roomService.getCurrencies() or similar exists or we make a direct call
        // For now, let's use a direct fetch to the new endpoint logic
        fetch('http://localhost:5085/api/currencies')
            .then(res => res.json())
            .then(data => setCurrencies(data))
            .catch(err => console.error("Currency fetch failed", err));
    }, []);

    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-4">
            <h3 className="text-gray-600 dark:text-gray-400 text-xs font-semibold mb-3 flex items-center gap-2">
                <span>📈</span> Döviz Kurları
            </h3>
            <div className="space-y-2 text-xs">
                {currencies.length > 0 ? currencies.map((c: any) => {
                    const rate = c.rate || c.Rate;
                    return (
                        <div key={c.code} className="flex justify-between items-center text-gray-500">
                            <span className="font-bold">{c.code}</span>
                            <span>{rate ? Number(rate).toFixed(4) : '-'}</span>
                        </div>
                    );
                }) : (
                    <div className="text-center text-gray-400">Yükleniyor...</div>
                )}
            </div>
        </div>
    );
}

function PansionWidget() {
    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-4">
            <h3 className="text-gray-600 dark:text-gray-400 text-xs font-semibold mb-3">Pansiyon Durumu</h3>
            <div className="h-24 flex items-end gap-2 text-[10px] text-gray-400">
                <div className="flex-1 flex flex-col justify-end items-center gap-1">
                    <div className="w-full bg-slate-700 h-[80%] rounded-t-sm"></div>
                    <span>BB</span>
                </div>
                <div className="flex-1 flex flex-col justify-end items-center gap-1">
                    <div className="w-full bg-slate-200 h-[10%] rounded-t-sm"></div>
                    <span>FB</span>
                </div>
                <div className="flex-1 flex flex-col justify-end items-center gap-1">
                    <div className="w-full bg-slate-200 h-[20%] rounded-t-sm"></div>
                    <span>HB</span>
                </div>
            </div>
        </div>
    );
}

// Live Chat Button
function ChatButton() {
    return (
        <button className="fixed bottom-6 right-6 w-12 h-12 bg-blue-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-800 transition-colors z-50">
            <FaCommentDots size={24} />
        </button>
    );
}

