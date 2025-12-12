"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FaSearch, FaPlus, FaCalendarAlt } from "react-icons/fa";
import GroupBookingModal from "@/components/reservations/GroupBookingModal";


export default function GroupReservationsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [groups, setGroups] = useState<any[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<any>(null); // For modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchGroups = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5266/api/groupbookings');
            if (res.ok) {
                const data = await res.json();
                setGroups(data);
            }
        } catch (error) {
            console.error("Error fetching groups:", error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchGroups();
    }, []);

    const filteredGroups = groups.filter(g =>
        (g.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (g.agency?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    const handleNewGroup = () => {
        setSelectedGroup(null);
        setIsModalOpen(true);
    };

    const handleEditGroup = (group: any) => {
        setSelectedGroup(group);
        setIsModalOpen(true);
    };

    const handleCloseModal = (shouldRefresh?: boolean) => {
        setIsModalOpen(false);
        if (shouldRefresh) {
            fetchGroups();
        }
    };

    return (
        <div className="h-full flex flex-col bg-gray-50 dark:bg-zinc-950 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Grup Rezervasyonları</h1>
                    <p className="text-gray-500 text-sm">Grup ve blokaj yönetimi</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 w-[300px]"
                            placeholder="Grup ara..."
                        />
                    </div>
                    <Button onClick={handleNewGroup} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                        <FaPlus /> Yeni Grup
                    </Button>
                </div>
            </div>

            {/* Quick Filters / Tabs (Mock) */}
            <div className="flex gap-2 mb-4">
                {['Tümü', 'Kesinleşmiş', 'Opsiyonlu', 'İptal', 'Waitlist'].map(status => (
                    <Button key={status} variant="outline" size="sm" className="rounded-full text-xs h-7">{status}</Button>
                ))}
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow border border-gray-200 dark:border-zinc-800 overflow-hidden flex-1">
                <div className="overflow-auto h-full">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50 dark:bg-zinc-950">
                                <TableHead className="w-[80px]">ID</TableHead>
                                <TableHead>Grup Adı</TableHead>
                                <TableHead>Acente</TableHead>
                                <TableHead>Giriş</TableHead>
                                <TableHead>Çıkış</TableHead>
                                <TableHead>Durum</TableHead>
                                <TableHead className="text-right">Bakiye</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-10">Yükleniyor...</TableCell>
                                </TableRow>
                            ) : filteredGroups.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-10 text-gray-400">Kayıt bulunamadı.</TableCell>
                                </TableRow>
                            ) : (
                                filteredGroups.map((group) => (
                                    <TableRow key={group.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900/50" onClick={() => handleEditGroup(group)}>
                                        <TableCell className="font-medium text-gray-500">#{group.id}</TableCell>
                                        <TableCell className="font-semibold text-gray-800 dark:text-gray-200">{group.name}</TableCell>
                                        <TableCell>{group.agency?.name || "-"}</TableCell>
                                        <TableCell>{new Date(group.checkInDate).toLocaleDateString("tr-TR")}</TableCell>
                                        <TableCell>{new Date(group.checkOutDate).toLocaleDateString("tr-TR")}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${group.status === 'Definite' ? 'bg-green-100 text-green-700' :
                                                group.status === 'Tentative' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {group.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right font-mono text-gray-700 dark:text-gray-300">
                                            {/* Balance not in model yet, mock 0 */}
                                            0 €
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Modal */}
            <GroupBookingModal
                isOpen={isModalOpen}
                onClose={() => handleCloseModal()}
                group={selectedGroup}
                onSave={() => handleCloseModal(true)}
            />
        </div>
    );
}
