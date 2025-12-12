"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { FaPlus, FaTrash, FaPrint, FaSync, FaEdit, FaSearch, FaFileExcel, FaBolt } from "react-icons/fa";
import { toast } from "sonner";
import { agencyService } from "@/lib/api";
import AgencyModal from "./AgencyModal";
import { ConfirmActionDialog } from "@/app/dashboard/sales/rates/RateModals";

export default function AgenciesPage() {
    const [agencies, setAgencies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAgencyId, setSelectedAgencyId] = useState<number | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const fetchAgencies = async () => {
        setLoading(true);
        try {
            const data = await agencyService.getAll();
            setAgencies(data);
        } catch (error) {
            console.error(error);
            toast.error("Acentalar listelenemedi.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgencies();
    }, []);

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await agencyService.delete(deleteId);
            toast.success("Acenta silindi.");
            fetchAgencies();
        } catch (error) {
            toast.error("Silme başarısız.");
        }
    };

    const filteredAgencies = Array.isArray(agencies) ? agencies.filter(a =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.code.toLowerCase().includes(search.toLowerCase())
    ) : [];

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-50 dark:bg-zinc-950">
            {/* Toolbar */}
            <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 p-2 flex items-center justify-between shadow-sm shrink-0">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-blue-900 dark:text-blue-400 mr-4 flex items-center gap-2">
                        <span className="bg-blue-100 p-1 rounded text-blue-800 text-sm">?</span> Acentalar
                    </h1>

                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedAgencyId(null); setModalOpen(true); }} className="text-blue-600 hover:bg-blue-50" title="Yeni Ekle">
                            <FaPlus className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" disabled={!selectedAgencyId} className="text-gray-600" title="Düzenle"
                            onClick={() => { if (selectedAgencyId) setModalOpen(true); }}
                        >
                            <FaEdit className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" disabled={!selectedAgencyId} onClick={() => setDeleteId(selectedAgencyId)} className="text-red-600 hover:bg-red-50" title="Sil">
                            <FaTrash className="h-5 w-5" />
                        </Button>
                        <div className="h-6 w-px bg-gray-300 mx-1"></div>
                        <Button variant="ghost" size="icon" className="text-gray-600"><FaPrint /></Button>
                        <Button variant="ghost" size="icon" onClick={fetchAgencies} className="text-gray-600"><FaSync /></Button>
                        <Button variant="ghost" size="icon" className="text-green-700"><FaFileExcel /></Button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-500">Toplam: {agencies.length}</span>
                </div>
            </div>

            {/* Data Grid with integrated filters */}
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-gray-50 dark:bg-zinc-800 sticky top-0 z-10 shadow-sm">
                        {/* Column Headers */}
                        <tr className="text-xs text-gray-500 font-semibold h-8 bg-gray-100 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700">
                            <th className="px-2 border-r border-gray-200 dark:border-zinc-700 w-16 min-w-[64px]">Id</th>
                            <th className="px-2 border-r border-gray-200 dark:border-zinc-700 w-32 min-w-[128px]">Acente Kodu</th>
                            <th className="px-2 border-r border-gray-200 dark:border-zinc-700 w-64 min-w-[256px]">Tam İsim</th>
                            <th className="px-2 border-r border-gray-200 dark:border-zinc-700 w-32 min-w-[128px]">Acente Grup</th>
                            <th className="px-2 border-r border-gray-200 dark:border-zinc-700 w-32 min-w-[128px]">Fiyat Kodu</th>
                            <th className="px-2 border-r border-gray-200 dark:border-zinc-700 w-32 min-w-[128px]">Market</th>
                            <th className="px-2 border-r border-gray-200 dark:border-zinc-700 w-32 min-w-[128px]">Segment</th>
                            <th className="px-2 border-r border-gray-200 dark:border-zinc-700 w-32 min-w-[128px]">Telefon</th>
                            <th className="px-2 border-r border-gray-200 dark:border-zinc-700 w-48 min-w-[192px]">E-mail</th>
                            <th className="px-2 w-32 min-w-[128px]">Acc Code</th>
                        </tr>
                        {/* Filter Row */}
                        <tr className="bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 h-10">
                            <td className="p-1 border-r border-gray-100 dark:border-zinc-800"><Input placeholder="Id" className="h-7 text-xs" disabled /></td>
                            <td className="p-1 border-r border-gray-100 dark:border-zinc-800"><Input placeholder="Ara..." className="h-7 text-xs" value={search} onChange={e => setSearch(e.target.value)} /></td>
                            <td className="p-1 border-r border-gray-100 dark:border-zinc-800"><Input placeholder="Ara..." className="h-7 text-xs" /></td>
                            <td className="p-1 border-r border-gray-100 dark:border-zinc-800"><Input placeholder="Ara..." className="h-7 text-xs" /></td>
                            <td className="p-1 border-r border-gray-100 dark:border-zinc-800"><Input placeholder="Ara..." className="h-7 text-xs" /></td>
                            <td className="p-1 border-r border-gray-100 dark:border-zinc-800"><Input placeholder="Ara..." className="h-7 text-xs" /></td>
                            <td className="p-1 border-r border-gray-100 dark:border-zinc-800"><Input placeholder="Ara..." className="h-7 text-xs" /></td>
                            <td className="p-1 border-r border-gray-100 dark:border-zinc-800"><Input placeholder="Ara..." className="h-7 text-xs" /></td>
                            <td className="p-1 border-r border-gray-100 dark:border-zinc-800"><Input placeholder="Ara..." className="h-7 text-xs" /></td>
                            <td className="p-1"><Input placeholder="Ara..." className="h-7 text-xs" /></td>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        {loading ? (
                            <tr><td colSpan={10} className="p-4 text-center text-gray-500">Yükleniyor...</td></tr>
                        ) : filteredAgencies.map((agency) => (
                            <tr
                                key={agency.id}
                                onClick={() => setSelectedAgencyId(agency.id)}
                                onDoubleClick={() => { setSelectedAgencyId(agency.id); setModalOpen(true); }}
                                className={cn(
                                    "cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors h-8 text-xs alternate:bg-gray-50",
                                    selectedAgencyId === agency.id ? "bg-blue-100 dark:bg-blue-900/40" : ""
                                )}
                            >
                                <td className="px-2 py-1 border-r border-gray-100 dark:border-zinc-800 text-gray-500">{agency.id}</td>
                                <td className="px-2 py-1 border-r border-gray-100 dark:border-zinc-800 font-medium">{agency.code}</td>
                                <td className="px-2 py-1 border-r border-gray-100 dark:border-zinc-800">{agency.name}</td>
                                <td className="px-2 py-1 border-r border-gray-100 dark:border-zinc-800">{agency.agencyGroup}</td>
                                <td className="px-2 py-1 border-r border-gray-100 dark:border-zinc-800">{agency.priceCode}</td>
                                <td className="px-2 py-1 border-r border-gray-100 dark:border-zinc-800">{agency.market}</td>
                                <td className="px-2 py-1 border-r border-gray-100 dark:border-zinc-800">{agency.segment}</td>
                                <td className="px-2 py-1 border-r border-gray-100 dark:border-zinc-800">{agency.phone}</td>
                                <td className="px-2 py-1 border-r border-gray-100 dark:border-zinc-800">{agency.email}</td>
                                <td className="px-2 py-1 text-gray-400">{agency.accountCode}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            <AgencyModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                agencyId={selectedAgencyId}
                onSuccess={fetchAgencies}
            />

            <ConfirmActionDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Acenta Silinecek"
                description="Bu acentayı silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
            />
        </div>
    );
}

// Helper for cn (clsx + twMerge) - usually in utils but here inline for speed if needed, 
// wait, I imported cn from lib/utils, so it's fine.
import { cn } from "@/lib/utils";
