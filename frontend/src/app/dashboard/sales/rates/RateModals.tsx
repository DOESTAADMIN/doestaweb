"use client";

import React, { useState } from "react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { FaCopy, FaPercentage, FaBan, FaCheckCircle, FaEuroSign, FaTimes } from "react-icons/fa";
import { cn } from "@/lib/utils";

interface PriceUpdateDialogProps {
    isOpen: boolean;
    onClose: () => void;
    currentPrice: number;
    onSave: (newPrice: number) => void;
    title?: string;
}

export function PriceUpdateDialog({ isOpen, onClose, currentPrice, onSave, title = "Fiyat Güncelle" }: PriceUpdateDialogProps) {
    const [price, setPrice] = useState(currentPrice);

    React.useEffect(() => {
        setPrice(currentPrice);
    }, [currentPrice, isOpen]);

    const handleSave = () => {
        onSave(price);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-0 shadow-2xl bg-white dark:bg-zinc-900">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center text-white relative">
                    <DialogTitle className="text-xl font-bold flex items-center justify-center gap-2">
                        <FaEuroSign className="text-blue-200" /> {title}
                    </DialogTitle>
                    <DialogDescription className="text-blue-100 mt-1 opacity-90">
                        Seçili gün için yeni fiyatı belirleyin.
                    </DialogDescription>
                    <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
                        <FaTimes />
                    </button>
                </div>

                <div className="p-8 flex flex-col items-center gap-6">
                    <div className="relative w-full max-w-[200px]">
                        <Input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(parseFloat(e.target.value))}
                            className="text-center text-3xl font-bold h-16 border-2 border-indigo-100 focus:border-indigo-500 rounded-xl shadow-inner bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">EUR</span>
                    </div>

                    <div className="flex gap-2 w-full justify-center">
                        <Button variant="outline" size="sm" onClick={() => setPrice(p => p + 10)} className="rounded-full px-4 text-xs font-semibold">+10</Button>
                        <Button variant="outline" size="sm" onClick={() => setPrice(p => p - 10)} className="rounded-full px-4 text-xs font-semibold">-10</Button>
                        <Button variant="outline" size="sm" onClick={() => setPrice(currentPrice)} className="rounded-full px-4 text-xs font-semibold">Sıfırla</Button>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 flex gap-3 justify-end border-t border-gray-100 dark:border-zinc-800">
                    <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700">Vazgeç</Button>
                    <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none min-w-[100px]">
                        Kaydet
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

interface ConfirmActionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
}

export function ConfirmActionDialog({ isOpen, onClose, onConfirm, title, description }: ConfirmActionDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-0 shadow-2xl bg-white dark:bg-zinc-900">
                <div className="p-6 pt-8 text-center flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl mb-2">
                        <FaBan />
                    </div>
                    <div>
                        <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</DialogTitle>
                        <DialogDescription className="text-gray-500 mt-2 max-w-[80%] mx-auto">
                            {description}
                        </DialogDescription>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 flex gap-3 justify-center border-t border-gray-100 dark:border-zinc-800">
                    <Button variant="outline" onClick={onClose} className="w-full">İptal</Button>
                    <Button variant="destructive" onClick={() => { onConfirm(); onClose(); }} className="w-full">
                        Onayla
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

interface BulkActionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onAction: (actionType: string, value?: any) => void;
}

export function BulkActionDialog({ isOpen, onClose, onAction }: BulkActionDialogProps) {
    const actions = [
        { id: 'copy_all', label: 'Tümünü Kopyala', desc: 'Bugünü diğer günlere kopyala', icon: FaCopy, color: 'bg-blue-100 text-blue-600', hover: 'hover:border-blue-500 hover:bg-blue-50' },
        { id: 'increase_percent', label: '%10 Artır', desc: 'Seçili aralıkta fiyat artışı', icon: FaPercentage, color: 'bg-green-100 text-green-600', hover: 'hover:border-green-500 hover:bg-green-50' },
        { id: 'stopsell_all', label: 'Acil Stop Sell', desc: 'Tüm odaları satışa kapat', icon: FaBan, color: 'bg-red-100 text-red-600', hover: 'hover:border-red-500 hover:bg-red-50' },
        { id: 'open_all', label: 'Satışa Aç', desc: 'Tüm kısıtlamaları kaldır', icon: FaCheckCircle, color: 'bg-teal-100 text-teal-600', hover: 'hover:border-teal-500 hover:bg-teal-50' },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-0 shadow-2xl bg-white dark:bg-zinc-900">
                <div className="bg-gray-900 p-6 flex items-center justify-between">
                    <div>
                        <DialogTitle className="text-xl font-bold text-white">Toplu İşlemler</DialogTitle>
                        <DialogDescription className="text-gray-400 mt-1">
                            Aşağıdaki işlemler tüm odalar ve görüntülenen tarih aralığı için uygulanır.
                        </DialogDescription>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-2 gap-4">
                    {actions.map((action) => (
                        <button
                            key={action.id}
                            onClick={() => { onAction(action.id); onClose(); }}
                            className={cn(
                                "flex items-start gap-4 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 transition-all text-left",
                                action.hover
                            )}
                        >
                            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0", action.color)}>
                                <action.icon />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">{action.label}</h4>
                                <p className="text-xs text-gray-500 mt-1">{action.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 flex justify-end border-t border-gray-100 dark:border-zinc-800">
                    <Button variant="outline" onClick={onClose}>Kapat</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
