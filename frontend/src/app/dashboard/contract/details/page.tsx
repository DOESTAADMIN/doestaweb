"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FaPlus, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function ContractDetailsPage() {
    const router = useRouter();
    const [contracts, setContracts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchContracts = async () => {
            try {
                const res = await fetch("http://localhost:5001/api/contracts");
                if (res.ok) {
                    setContracts(await res.json());
                }
            } catch (error) {
                console.error("Failed to fetch contracts", error);
            }
        };
        fetchContracts();
    }, []);

    const filteredContracts = contracts.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.agency?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col bg-gray-50 dark:bg-zinc-950 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Kontrat Listesi</h1>
                    <p className="text-gray-500 text-sm">Tüm acente ve şirket kontratları</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 w-[300px]"
                            placeholder="Kontrat ara..."
                        />
                    </div>
                    <Button onClick={() => router.push("/dashboard/contract/wizard")} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                        <FaPlus /> Yeni Kontrat
                    </Button>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow border border-gray-200 dark:border-zinc-800 overflow-hidden flex-1">
                <div className="overflow-auto h-full">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50 dark:bg-zinc-950">
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Kontrat Adı</TableHead>
                                <TableHead>Kod</TableHead>
                                <TableHead>Acente</TableHead>
                                <TableHead>Dönemler</TableHead>
                                <TableHead className="text-right">İşlemler</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredContracts.map((contract) => (
                                <TableRow key={contract.id} className="cursor-pointer hover:bg-gray-50">
                                    <TableCell className="font-medium text-gray-500">#{contract.id}</TableCell>
                                    <TableCell className="font-semibold text-gray-800 dark:text-gray-200">{contract.name}</TableCell>
                                    <TableCell><span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600 font-mono">{contract.code}</span></TableCell>
                                    <TableCell>{contract.agency?.name}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            {contract.periods?.length || 0} Dönem
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600"><FaEdit /></Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500"><FaTrash /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredContracts.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-gray-400">
                                        Kayıt bulunamadı.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
