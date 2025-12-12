"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button"; // Added Button
import { Input } from "@/components/ui/Input"; // Correct casing
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaSave, FaTimes, FaPlus } from "react-icons/fa";

interface GroupBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    group?: any; // Pass existing data if edit
    onSave?: () => void;
}

export default function GroupBookingModal({ isOpen, onClose, group, onSave }: GroupBookingModalProps) {
    const [activeTab, setActiveTab] = useState("details");
    const [formData, setFormData] = useState<any>({});
    const [agencies, setAgencies] = useState<any[]>([]);

    React.useEffect(() => {
        if (isOpen) {
            // Fetch Agencies
            fetch('http://localhost:5266/api/agencies')
                .then(res => res.json())
                .then(data => setAgencies(data))
                .catch(err => console.error(err));

            if (group) {
                setFormData({
                    ...group,
                    checkInDate: group.checkInDate ? group.checkInDate.split('T')[0] : '',
                    checkOutDate: group.checkOutDate ? group.checkOutDate.split('T')[0] : ''
                });
            } else {
                setFormData({
                    name: '',
                    agencyId: '',
                    status: 'Tentative',
                    checkInDate: new Date().toISOString().split('T')[0],
                    checkOutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0]
                });
            }
        }
    }, [isOpen, group]);

    const handleChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            const url = group ? `http://localhost:5266/api/groupbookings/${group.id}` : 'http://localhost:5266/api/groupbookings';
            const method = group ? 'PUT' : 'POST';

            // Fix AgencyId type
            const payload = {
                ...formData,
                id: group ? group.id : 0,
                agencyId: formData.agencyId ? parseInt(formData.agencyId) : null
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                if (onSave) onSave();
                onClose();
            } else {
                alert("Kaydetme başarısız!");
            }
        } catch (error) {
            console.error("Error saving group:", error);
            alert("Hata oluştu.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[1200px] h-[85vh] p-0 flex flex-col gap-0 bg-gray-100 dark:bg-zinc-950">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-100 p-2 rounded text-blue-600 font-bold">GRP</div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-800 dark:text-white">{group ? 'Grup Düzenle' : 'Yeni Grup Kartı'}</h2>
                                <p className="text-xs text-gray-500">ID: {group ? `#${group.id}` : '#NEW'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={onClose}><FaTimes className="mr-2" /> Vazgeç</Button>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave}><FaSave className="mr-2" /> Kaydet</Button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-hidden flex">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                            <div className="px-4 pt-2 bg-gray-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
                                <TabsList className="bg-transparent gap-4">
                                    <TabsTrigger value="details" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-4 py-2">Grup Bilgileri</TabsTrigger>
                                    <TabsTrigger value="rooms" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-4 py-2">Oda Dağılımı</TabsTrigger>
                                    <TabsTrigger value="reservations" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-4 py-2">Rezervasyonlar</TabsTrigger>
                                    <TabsTrigger value="folio" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-4 py-2">Folyo</TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="flex-1 overflow-auto bg-gray-100/50 p-4">
                                <TabsContent value="details" className="m-0 h-full">
                                    <div className="grid grid-cols-2 gap-6 h-full">
                                        {/* Left Column: Main Info */}
                                        <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
                                            <h3 className="font-semibold text-gray-700 border-b pb-2 mb-4">Genel Bilgiler</h3>
                                            <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
                                                <Label className="text-right text-gray-500">Grup Adı</Label>
                                                <Input
                                                    className="h-9"
                                                    placeholder="Örn: 2025 Kış Grubu"
                                                    value={formData.name || ''}
                                                    onChange={e => handleChange('name', e.target.value)}
                                                />
                                            </div>
                                            <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
                                                <Label className="text-right text-gray-500">Acente</Label>
                                                <select
                                                    className="h-9 border rounded px-2 w-full text-sm bg-background"
                                                    value={formData.agencyId || ''}
                                                    onChange={e => handleChange('agencyId', e.target.value)}
                                                >
                                                    <option value="">Seçiniz...</option>
                                                    {agencies.map((a: any) => (
                                                        <option key={a.id} value={a.id}>{a.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
                                                <Label className="text-right text-gray-500">Grup Lideri</Label>
                                                <Input
                                                    className="h-9"
                                                    value={formData.groupLeader || ''}
                                                    onChange={e => handleChange('groupLeader', e.target.value)}
                                                />
                                            </div>
                                            <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
                                                <Label className="text-right text-gray-500">Durum</Label>
                                                <select
                                                    className="h-9 border rounded px-2 w-full text-sm bg-background"
                                                    value={formData.status || 'Tentative'}
                                                    onChange={e => handleChange('status', e.target.value)}
                                                >
                                                    <option value="Definite">Definite (Kesin)</option>
                                                    <option value="Tentative">Tentative (Opsiyonlu)</option>
                                                    <option value="Cancelled">İptal</option>
                                                </select>
                                            </div>

                                            <div className="grid grid-cols-[120px_1fr] gap-4 items-center mt-6">
                                                <Label className="text-right text-gray-500">Giriş Tarihi</Label>
                                                <Input
                                                    type="date"
                                                    className="h-9"
                                                    value={formData.checkInDate || ''}
                                                    onChange={e => handleChange('checkInDate', e.target.value)}
                                                />
                                            </div>
                                            <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
                                                <Label className="text-right text-gray-500">Çıkış Tarihi</Label>
                                                <Input
                                                    type="date"
                                                    className="h-9"
                                                    value={formData.checkOutDate || ''}
                                                    onChange={e => handleChange('checkOutDate', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {/* Right Column: Financial & Notes */}
                                        <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
                                            <h3 className="font-semibold text-gray-700 border-b pb-2 mb-4">Notlar</h3>
                                            <textarea
                                                className="w-full h-32 border rounded p-2 text-sm bg-background"
                                                placeholder="Grup ile ilgili notlar..."
                                                value={formData.note || ''}
                                                onChange={e => handleChange('note', e.target.value)}
                                            ></textarea>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="reservations" className="m-0 h-full">
                                    <div className="bg-white rounded-lg shadow-sm border h-full flex flex-col">
                                        <div className="p-2 border-b flex justify-end">
                                            <Button size="sm" className="gap-2"><FaPlus /> Rezervasyon Ekle</Button>
                                        </div>
                                        <div className="flex-1 p-4 text-center text-gray-400 flex items-center justify-center italic">
                                            {group && group.reservations && group.reservations.length > 0 ? (
                                                <span className="text-green-600">Rezervasyon listesi buraya gelecek ({group.reservations.length} kayıt)</span>
                                            ) : (
                                                <span>Henüz rezervasyon bulunmuyor.</span>
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
