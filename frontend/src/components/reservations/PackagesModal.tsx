"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { X, Save, Printer, Lock, History, ChevronLeft, ChevronRight, Zap, RefreshCw, FileSpreadsheet, Plus, Edit2, Trash2, Check, ArrowUp, Menu, ArrowRightLeft, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

interface PackagesModalProps {
    isOpen: boolean;
    onClose: () => void;
    reservationId?: string;
    reservationInfo?: string;
}

export default function PackagesModal({ isOpen, onClose, reservationId, reservationInfo }: PackagesModalProps) {
    // Placeholder data
    const packages = [];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl bg-white p-0 gap-0 overflow-hidden h-[80vh] flex flex-col">
                {/* HEADER / TOOLBAR */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-blue-900">Paketler</h2>
                        <button className="text-gray-500 hover:text-gray-700 bg-gray-100 p-1 rounded"><History size={16} /></button>
                        <button className="text-gray-500 hover:text-gray-700 bg-gray-100 p-1 rounded"><Lock size={16} /></button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={onClose}><Check className="text-blue-600" size={24} /></button>
                        <button onClick={onClose}><X className="text-red-500" size={24} /></button>
                    </div>
                </div>

                {/* Sub-Header Info */}
                <div className="px-4 py-2 border-b border-dotted border-gray-300 bg-white">
                    <span className="text-[10px] text-gray-400 block">Rez Bilgi</span>
                    <span className="text-sm text-gray-600 font-medium">{reservationInfo || "Ahmet Uzun / Hasan Gerçek 08.12 - 13.12.2020 (6145629)"}</span>
                </div>

                {/* Toolbar Actions */}
                <div className="flex items-center px-4 py-2 border-b border-gray-200 bg-gray-50 gap-2">
                    <button className="p-1 hover:bg-gray-200 rounded text-gray-600 font-bold"><Plus size={20} className="text-blue-600" /></button>
                    <button className="p-1 hover:bg-gray-200 rounded text-gray-600"><Edit2 size={18} className="text-blue-900" /></button>
                    <button className="p-1 hover:bg-gray-200 rounded text-red-600"><Trash2 size={18} /></button>
                    <div className="w-px h-5 bg-gray-300 mx-1"></div>
                    <button className="p-1 hover:bg-gray-200 rounded text-green-600"><Check size={18} /></button>
                    <button className="p-1 hover:bg-gray-200 rounded text-gray-600"><Printer size={18} /></button>
                    <button className="p-1 hover:bg-gray-200 rounded text-gray-600"><RefreshCw size={18} /></button>
                    <button className="p-1 hover:bg-gray-200 rounded text-green-700"><FileSpreadsheet size={18} /></button>
                    <div className="w-px h-5 bg-gray-300 mx-1"></div>
                    <button className="p-1 hover:bg-gray-200 rounded text-gray-600"><ArrowUp size={18} /></button>
                    <button className="p-1 hover:bg-gray-200 rounded text-gray-600"><Menu size={18} /></button>
                    <button className="p-1 hover:bg-gray-200 rounded text-gray-600"><ArrowRightLeft size={18} /></button>
                    <button className="p-1 hover:bg-gray-200 rounded text-black"><Zap size={18} fill="black" /></button>

                    <div className="flex-1"></div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 cursor-pointer hover:text-gray-700">Verileri Yükle <Download size={14} /></div>
                </div>

                {/* Grid Content */}
                <div className="flex-1 flex flex-col bg-white overflow-hidden">
                    {/* Grouping Area */}
                    <div className="bg-gray-100 p-2 text-xs text-gray-400 border-b border-gray-200 pl-4">
                        Drag here to set row groups
                    </div>

                    {/* Grid Header */}
                    <div className="overflow-auto flex-1">
                        <table className="w-full text-xs text-left whitespace-nowrap">
                            <thead className="bg-white border-b-2 border-gray-200 sticky top-0 text-gray-600 font-semibold">
                                <tr>
                                    <th className="p-2 border-r border-gray-100 min-w-[100px]"><input className="w-full border-b border-gray-200 outline-none" placeholder="Tanımlı" /></th>
                                    <th className="p-2 border-r border-gray-100 min-w-[150px]"><input className="w-full border-b border-gray-200 outline-none" placeholder="Paket Adı" /></th>
                                    <th className="p-2 border-r border-gray-100 min-w-[80px]"><input className="w-full border-b border-gray-200 outline-none" placeholder="Oda Başı" /></th>
                                    <th className="p-2 border-r border-gray-100 min-w-[80px]"><input className="w-full border-b border-gray-200 outline-none" placeholder="Kişi Başı" /></th>
                                    <th className="p-2 border-r border-gray-100 min-w-[100px]"><input className="w-full border-b border-gray-200 outline-none" placeholder="Oda Fiyatı %" /></th>
                                    <th className="p-2 border-r border-gray-100 min-w-[80px]"><input className="w-full border-b border-gray-200 outline-none" placeholder="Döviz" /></th>
                                    <th className="p-2 border-r border-gray-100 min-w-[100px]"><input className="w-full border-b border-gray-200 outline-none" placeholder="Charge Tipi" /></th>
                                    <th className="p-2 border-r border-gray-100 min-w-[80px]"><input className="w-full border-b border-gray-200 outline-none" placeholder="Pan" /></th>
                                    <th className="p-2 border-r border-gray-100 min-w-[150px]"><input className="w-full border-b border-gray-200 outline-none" placeholder="İşlenecek Departman" /></th>
                                    <th className="p-2 border-r border-gray-100 min-w-[150px]"><input className="w-full border-b border-gray-200 outline-none" placeholder="İşlenecek Gelir Grubu" /></th>
                                    <th className="p-2 border-r border-gray-100 min-w-[150px]"><input className="w-full border-b border-gray-200 outline-none" placeholder="Düşülecek Departman" /></th>
                                    <th className="p-2 border-r border-gray-100 min-w-[150px]"><input className="w-full border-b border-gray-200 outline-none" placeholder="Düşülecek Gelir Grubu" /></th>
                                    <th className="p-2 min-w-[80px]"><input className="w-full border-b border-gray-200 outline-none" placeholder="Atlandı" /></th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Empty State for now */}
                                <tr>
                                    <td colSpan={13}></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Button */}
                <div className="p-2 border-t border-gray-200 bg-white">
                    <Button className="bg-[#a51c30] hover:bg-[#8a1728] text-white font-bold text-xs h-8 px-6">
                        <span className="mr-2">📈</span> Günlük Fiyat Analizi
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
