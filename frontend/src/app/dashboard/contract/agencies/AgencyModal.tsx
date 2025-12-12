"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FaPrint, FaLock, FaSave, FaTimes, FaPlus, FaTrash, FaPhone, FaEdit } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { agencyService } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AgencyModalProps {
    isOpen: boolean;
    onClose: () => void;
    agencyId?: number | null;
    onSuccess: () => void;
}

export default function AgencyModal({ isOpen, onClose, agencyId, onSuccess }: AgencyModalProps) {
    const { register, handleSubmit, reset, setValue, watch } = useForm();
    const [activeTab, setActiveTab] = useState("ek_bilgiler");

    useEffect(() => {
        if (isOpen && agencyId) {
            loadAgency(agencyId);
        } else if (isOpen) {
            reset({
                code: "", name: "", agencyGroup: "OTA", market: "Global",
                currency: "EUR", isActive: true
            });
        }
    }, [isOpen, agencyId]);

    const loadAgency = async (id: number) => {
        try {
            const data = await agencyService.getById(id);
            reset(data);
        } catch (e) {
            toast.error("Acenta bilgileri yüklenemedi");
        }
    };

    const onSubmit = async (data: any) => {
        try {
            if (agencyId) {
                await agencyService.update(agencyId, data);
                toast.success("Acenta güncellendi");
            } else {
                await agencyService.create(data);
                toast.success("Acenta oluşturuldu");
            }
            onSuccess();
            onClose();
        } catch (e) {
            toast.error("Kaydetme başarısız");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[1100px] h-[85vh] p-0 flex flex-col gap-0 bg-gray-50 dark:bg-zinc-900 border-0 shadow-2xl overflow-hidden">
                <DialogDescription className="sr-only">Acenta detay düzenleme formu</DialogDescription>
                {/* Header */}
                <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 p-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        <DialogTitle className="text-xl font-bold text-blue-900 dark:text-blue-400">Seyahat Acentesi</DialogTitle>
                        {agencyId && <span className="text-sm text-gray-500">ID: {agencyId}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-800 p-1 rounded-md">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600"><FaPrint /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600"><FaLock /></Button>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose}><FaTimes className="h-5 w-5" /></Button>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Left Sidebar Form */}
                    <div className="w-[320px] bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 p-4 overflow-y-auto flex flex-col gap-4 shrink-0">
                        <div className="grid gap-2">
                            <Label className="text-xs text-gray-500">Acente Kodu *</Label>
                            <Input {...register("code")} className="h-8 text-sm font-semibold" required />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs text-gray-500">Tam İsim *</Label>
                            <Input {...register("name")} className="h-8 text-sm" required />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs text-gray-500">Fiyat Kodu</Label>
                            <div className="flex gap-1">
                                <Input {...register("priceCode")} className="h-8 text-sm" />
                                <Button type="button" variant="outline" size="icon" className="h-8 w-8 shrink-0">...</Button>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs text-gray-500">Satış Yetkilisi</Label>
                            <div className="flex gap-1">
                                <Input className="h-8 text-sm" {...register("salesManager")} />
                                <Button type="button" variant="outline" size="icon" className="h-8 w-8 shrink-0">...</Button>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 dark:border-zinc-800 my-1"></div>

                        <div className="grid gap-2">
                            <Label className="text-xs text-gray-500">Kontak Adı</Label>
                            <Input className="h-8 text-sm" {...register("contactName")} />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs text-gray-500">Pozisyon</Label>
                            <Input className="h-8 text-sm" {...register("position")} />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs text-gray-500">Telefon</Label>
                            <Input {...register("phone")} className="h-8 text-sm" />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs text-gray-500">E-mail</Label>
                            <Input {...register("email")} className="h-8 text-sm" />
                        </div>

                        <div className="border-t border-gray-100 dark:border-zinc-800 my-1"></div>

                        <div className="grid gap-2">
                            <Label className="text-xs text-gray-500">Web Anahtarı</Label>
                            <Input className="h-8 text-sm" {...register("webAddress")} />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs text-gray-500">Portal Satıcı</Label>
                            <Input className="h-8 text-sm" {...register("portalVendor")} />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs text-gray-500">Notlar</Label>
                            <Input {...register("note")} className="h-16 text-sm" />
                        </div>

                        <div className="flex gap-4 mt-2">
                            <div className="flex items-center gap-2">
                                <Switch defaultChecked={true} {...register("isAgency")} /> <span className="text-xs">Acente mi?</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Switch {...register("isCompany")} /> <span className="text-xs">Firma mı?</span>
                            </div>
                        </div>

                        <div className="mt-2">
                            <Label className="text-xs text-gray-500">Bavel Kodu</Label>
                            <Input {...register("bavelCode")} className="h-8 text-sm" />
                        </div>
                    </div>

                    {/* Right Content Area (Tabs) */}
                    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-zinc-950 overflow-hidden">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                            <div className="bg-gray-100 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-2 pt-2">
                                <TabsList className="bg-transparent h-10 p-0 gap-1">
                                    {["Ek Bilgiler", "Muhasebe Bilgileri", "Stop Sell", "Acente Kontenjan", "Acenta İndirimleri", "Yetkililer", "Folio Routing"].map(tab => {
                                        const val = tab.toLowerCase().replace(' ', '_');
                                        return (
                                            <TabsTrigger
                                                key={val}
                                                value={val}
                                                className="rounded-t-md rounded-b-none border border-transparent data-[state=active]:bg-white data-[state=active]:border-gray-200 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:border-zinc-700 h-full px-4 text-xs font-medium text-gray-600 dark:text-gray-400 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400"
                                            >
                                                {tab}
                                            </TabsTrigger>
                                        )
                                    })}
                                </TabsList>
                            </div>

                            <TabsContent value="ek_bilgiler" className="flex-1 p-6 overflow-y-auto m-0">
                                {/* ... ek_bilgiler content omitted for brevity, keeping existing ... */}
                                <div className="space-y-6 max-w-4xl">
                                    <div className="grid gap-4">
                                        <div className="grid grid-cols-[120px_1fr_auto] gap-2 items-center">
                                            <Label className="text-xs text-right text-gray-500">İletişim Adresi</Label>
                                            <Input {...register("address")} className="h-8 text-sm" />
                                            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 text-lg">+</Button>
                                        </div>
                                        <div className="grid grid-cols-[120px_1fr_auto] gap-2 items-center">
                                            <Label className="text-xs text-right text-gray-500">Fatura Adresi</Label>
                                            <Input {...register("invoiceAddress")} className="h-8 text-sm" />
                                            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 text-lg">+</Button>
                                        </div>
                                        <div className="grid grid-cols-[120px_1fr_120px] gap-2 items-center">
                                            <Label className="text-xs text-right text-gray-500">Hesap Kodu ve Adı</Label>
                                            <Input {...register("accountCode")} className="h-8 text-sm" placeholder="120..." />
                                            <Button type="button" onClick={(e) => { e.preventDefault(); setValue('accountCode', '120.01.' + Math.floor(Math.random() * 999)); }} className="h-8 bg-blue-700 hover:bg-blue-800 text-white text-xs">Oluştur</Button>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 dark:border-zinc-800"></div>
                                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Varsayılan Ayarlar</h3>

                                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                        <div className="grid gap-1.5">
                                            <Label className="text-xs text-gray-500">Varsayılan Oda Tipi</Label>
                                            <Input {...register("defaultRoomType")} className="h-8 text-sm" />
                                        </div>
                                        <div className="grid gap-1.5">
                                            <Label className="text-xs text-gray-500">Varsayılan Uyruk</Label>
                                            <Input {...register("defaultNationality")} className="h-8 text-sm" />
                                        </div>
                                        <div className="grid gap-1.5">
                                            <Label className="text-xs text-gray-500">Market</Label>
                                            <Input {...register("market")} className="h-8 text-sm" />
                                        </div>
                                        <div className="grid gap-1.5">
                                            <Label className="text-xs text-gray-500">Kaynak</Label>
                                            <Input {...register("source")} className="h-8 text-sm" />
                                        </div>

                                        <div className="grid gap-1.5">
                                            <Label className="text-xs text-gray-500">Segment</Label>
                                            <Input {...register("segment")} className="h-8 text-sm" />
                                        </div>
                                        <div className="grid gap-1.5">
                                            <Label className="text-xs text-gray-500">Fiyat Tipi</Label>
                                            <Input className="h-8 text-sm" />
                                        </div>
                                        <div className="grid gap-1.5">
                                            <Label className="text-xs text-gray-500">Ödeyen</Label>
                                            <Input {...register("payer")} className="h-8 text-sm" defaultValue="Acente" />
                                        </div>
                                        <div className="grid gap-1.5">
                                            <Label className="text-xs text-gray-500">Ödeme Tipi</Label>
                                            <Input {...register("paymentType")} className="h-8 text-sm" defaultValue="Krediye Kaldır" />
                                        </div>

                                        <div className="grid gap-1.5">
                                            <Label className="text-xs text-gray-500">Konaklama Tipi</Label>
                                            <Input {...register("accommodationType")} className="h-8 text-sm" defaultValue="Sold" />
                                        </div>
                                        <div className="grid gap-1.5">
                                            <Label className="text-xs text-gray-500">Varsayılan Döviz</Label>
                                            <div className="flex items-center gap-2">
                                                <Input {...register("currency")} className="h-8 text-sm w-20" />
                                                <div className="flex items-center gap-2">
                                                    <Switch {...register("manualPriceActive")} className="data-[state=checked]:bg-red-500" />
                                                    <Label className="text-xs">Manuel Fiyat Aktif</Label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid gap-1.5">
                                            <Label className="text-xs text-gray-500">Varsayılan Blok</Label>
                                            <Input {...register("defaultBlock")} className="h-8 text-sm" />
                                        </div>
                                        <div className="grid gap-1.5">
                                            <Label className="text-xs text-gray-500">Vergi Basılacak Hesap</Label>
                                            <Input {...register("taxAccount")} className="h-8 text-sm" defaultValue="Varsayılan" />
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 dark:border-zinc-800"></div>

                                    <div className="grid gap-2">
                                        <Label className="text-xs font-semibold text-gray-700">Genel Bilgi</Label>
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2">
                                                <Switch {...register("isActive")} />
                                                <Label className="text-sm">Pasif</Label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Switch {...register("isBlacklisted")} />
                                                <Label className="text-sm">Kara Liste</Label>
                                            </div>
                                            <Input {...register("blacklistReason")} placeholder="Kara Liste Sebebi" className="h-8 text-sm flex-1" />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className="text-xs font-semibold text-gray-700">Manuel Fiyat Çocuk Durumları</Label>
                                        <div className="flex gap-6">
                                            <div className="flex items-center gap-2">
                                                <Switch {...register("child1Free")} />
                                                <Label className="text-xs">1.Çck Free</Label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Switch {...register("child2Free")} />
                                                <Label className="text-xs">2.Çck Free</Label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Switch {...register("child3Free")} />
                                                <Label className="text-xs">3.Çck Free</Label>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </TabsContent>

                            <TabsContent value="muhasebe_bilgileri" className="p-6 overflow-y-auto m-0 flex-1">
                                <div className="space-y-6">
                                    {/* Top Row: Tax & Policy Info */}
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="grid gap-2">
                                            <div className="grid grid-cols-[140px_1fr] gap-2 items-center">
                                                <Label className="text-xs text-right text-gray-500">Vergi Dairesi</Label>
                                                <Input {...register("taxOffice")} className="h-8 text-sm" />
                                            </div>
                                            <div className="grid grid-cols-[140px_1fr] gap-2 items-center">
                                                <Label className="text-xs text-right text-gray-500">Vergi No</Label>
                                                <Input {...register("taxNo")} className="h-8 text-sm" />
                                            </div>
                                            <div className="grid grid-cols-[140px_1fr] gap-2 items-center">
                                                <Label className="text-xs text-right text-gray-500">Vergi Kontak Kişi</Label>
                                                <Input {...register("taxContactPerson")} className="h-8 text-sm" />
                                            </div>
                                            <div className="grid grid-cols-[140px_1fr] gap-2 items-center">
                                                <Label className="text-xs text-right text-gray-500">Vergi Kontak E-Mail</Label>
                                                <Input {...register("taxContactEmail")} className="h-8 text-sm" />
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <div className="grid grid-cols-[140px_1fr] gap-2 items-center">
                                                <Label className="text-xs text-right text-gray-500">İptal Politikası</Label>
                                                <Input {...register("cancellationPolicy")} className="h-8 text-sm" />
                                            </div>
                                            <div className="grid grid-cols-[140px_1fr] gap-2 items-center">
                                                <Label className="text-xs text-right text-gray-500">Ödeme Politikası</Label>
                                                <Input {...register("paymentPolicy")} className="h-8 text-sm" />
                                            </div>
                                            <div className="grid grid-cols-[140px_1fr] gap-2 items-center">
                                                <Label className="text-xs text-right text-gray-500">Fatura Sıklık Günleri</Label>
                                                <div className="flex gap-2">
                                                    <Input {...register("invoiceFrequencyDays")} className="h-8 text-sm w-20" placeholder="Gün" />
                                                    <Input {...register("invoicePaymentDay")} className="h-8 text-sm w-20" placeholder="Ödeme" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-[140px_1fr] gap-2 items-center">
                                                <Label className="text-xs text-right text-gray-500">PO Numarası</Label>
                                                <Input {...register("poNumber")} className="h-8 text-sm" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 dark:border-zinc-800"></div>

                                    {/* Middle Row: Credit & Risk */}
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-bold text-gray-700">#Credit Limit Control#</h4>

                                            <div className="flex items-center gap-2 mb-2">
                                                <Checkbox id="cityLedger" {...register("cityLedgerActive")} />
                                                <Label htmlFor="cityLedger" className="text-xs">City Ledger Aktif</Label>
                                            </div>

                                            <div className="grid grid-cols-[140px_1fr] gap-2 items-center">
                                                <Label className="text-xs text-right text-gray-500">Krediye Kaldırma Limiti</Label>
                                                <Input {...register("creditLimit")} className="h-8 text-sm" />
                                            </div>
                                            <div className="grid grid-cols-[140px_1fr] gap-2 items-center">
                                                <Label className="text-xs text-right text-gray-500">Toplam Risk Limiti</Label>
                                                <Input {...register("totalRiskLimit")} className="h-8 text-sm" />
                                            </div>
                                            <div className="grid grid-cols-[140px_1fr] gap-2 items-center">
                                                <Label className="text-xs text-right text-gray-500">Üst Risk Limiti</Label>
                                                <Input {...register("upperRiskLimit")} className="h-8 text-sm" />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <h4 className="text-xs font-bold text-gray-700">#Account Control#</h4>

                                            <div className="flex items-center gap-2 mb-2">
                                                <Checkbox id="acctCard" {...register("openAccountCard")} />
                                                <Label htmlFor="acctCard" className="text-xs">Hesap Kartı Aç</Label>
                                            </div>

                                            <div className="grid grid-cols-[140px_1fr] gap-2 items-center">
                                                <Label className="text-xs text-right text-gray-500">Ön Ödeme Hesabı</Label>
                                                <Input {...register("prepaymentAccount")} className="h-8 text-sm" />
                                            </div>
                                            <div className="grid grid-cols-[140px_1fr] gap-2 items-center">
                                                <Label className="text-xs text-right text-gray-500">Yönlendirilen HesapID</Label>
                                                <Input {...register("directedAccountId")} className="h-8 text-sm" />
                                            </div>
                                            <div className="grid grid-cols-[140px_1fr] gap-2 items-center">
                                                <Label className="text-xs text-right text-gray-500">GL Hesap ID</Label>
                                                <Input {...register("glAccountId")} className="h-8 text-sm" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 dark:border-zinc-800"></div>

                                    {/* Bottom: Codes */}
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="grid grid-cols-[140px_1fr] gap-2 items-center">
                                            <Label className="text-xs text-right text-gray-500">Hesap Kodu</Label>
                                            <Input {...register("accountCode")} className="h-8 text-sm" disabled />
                                        </div>
                                        <div className="grid grid-cols-[140px_1fr] gap-2 items-center">
                                            <Label className="text-xs text-right text-gray-500">Avans Kodu</Label>
                                            <Input {...register("advanceCode")} className="h-8 text-sm" />
                                        </div>
                                        <div className="grid grid-cols-[140px_1fr] gap-2 items-center">
                                            <Label className="text-xs text-right text-gray-500">Kanal Komisyon Oranı</Label>
                                            <Input {...register("commissionRate")} className="h-8 text-sm" placeholder="%" />
                                        </div>
                                    </div>

                                </div>
                            </TabsContent>

                            <TabsContent value="stop_sell" className="p-6 overflow-y-auto m-0 flex-1">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold text-sm text-gray-700">Stop Sell Tanımları</h3>
                                        <Button size="sm" className="h-7 text-xs bg-blue-600 text-white"><FaPlus className="mr-1" /> Yeni Ekle</Button>
                                    </div>
                                    <div className="border rounded-md bg-white">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-gray-50 hover:bg-gray-50">
                                                    <TableHead className="h-8 text-xs font-semibold text-gray-600">Başlangıç</TableHead>
                                                    <TableHead className="h-8 text-xs font-semibold text-gray-600">Bitiş</TableHead>
                                                    <TableHead className="h-8 text-xs font-semibold text-gray-600">Oda Tipi</TableHead>
                                                    <TableHead className="h-8 text-xs font-semibold text-gray-600">Pansiyon</TableHead>
                                                    <TableHead className="h-8 text-xs font-semibold text-gray-600">Tüm Kanallar</TableHead>
                                                    <TableHead className="h-8 text-xs font-semibold text-gray-600 w-[50px]"></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {/* Placeholder Data */}
                                                <TableRow className="h-8 text-xs">
                                                    <TableCell className="py-2">01.06.2025</TableCell>
                                                    <TableCell className="py-2">15.06.2025</TableCell>
                                                    <TableCell className="py-2">STD</TableCell>
                                                    <TableCell className="py-2">Tümü</TableCell>
                                                    <TableCell className="py-2">Evet</TableCell>
                                                    <TableCell className="py-2 text-right text-red-500 cursor-pointer"><FaTrash /></TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="acente_kontenjan" className="p-6 overflow-y-auto m-0 flex-1">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold text-sm text-gray-700">Kontenjan Tanımları</h3>
                                        <Button size="sm" className="h-7 text-xs bg-blue-600 text-white"><FaPlus className="mr-1" /> Yeni Ekle</Button>
                                    </div>
                                    <div className="border rounded-md bg-white">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-gray-50 hover:bg-gray-50">
                                                    <TableHead className="h-8 text-xs font-semibold text-gray-600">Dönem Adı</TableHead>
                                                    <TableHead className="h-8 text-xs font-semibold text-gray-600">Başlangıç</TableHead>
                                                    <TableHead className="h-8 text-xs font-semibold text-gray-600">Bitiş</TableHead>
                                                    <TableHead className="h-8 text-xs font-semibold text-gray-600">Oda Tipi</TableHead>
                                                    <TableHead className="h-8 text-xs font-semibold text-gray-600">Adet</TableHead>
                                                    <TableHead className="h-8 text-xs font-semibold text-gray-600">Opsiyon (Gün)</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow className="text-xs">
                                                    <TableCell className="py-2 font-medium">Yaz Sezonu 2025</TableCell>
                                                    <TableCell className="py-2">01.05.2025</TableCell>
                                                    <TableCell className="py-2">31.10.2025</TableCell>
                                                    <TableCell className="py-2">STD</TableCell>
                                                    <TableCell className="py-2">10</TableCell>
                                                    <TableCell className="py-2">14</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="acenta_indirimleri" className="p-6 overflow-y-auto m-0 flex-1">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold text-sm text-gray-700">Aksiyon ve İndirimler</h3>
                                        <Button size="sm" className="h-7 text-xs bg-blue-600 text-white"><FaPlus className="mr-1" /> Yeni Ekle</Button>
                                    </div>
                                    <div className="border rounded-md bg-white">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-gray-50 hover:bg-gray-50">
                                                    <TableHead className="h-8 text-xs font-semibold text-gray-600">İndirim Adı</TableHead>
                                                    <TableHead className="h-8 text-xs font-semibold text-gray-600">Tip</TableHead>
                                                    <TableHead className="h-8 text-xs font-semibold text-gray-600">Dönem</TableHead>
                                                    <TableHead className="h-8 text-xs font-semibold text-gray-600">Konaklama</TableHead>
                                                    <TableHead className="h-8 text-xs font-semibold text-gray-600">Oran/Tutar</TableHead>
                                                    <TableHead className="h-8 text-xs font-semibold text-gray-600">Kümülatif?</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow className="text-xs">
                                                    <TableCell className="py-2 font-medium">Erken Rezervasyon %10</TableCell>
                                                    <TableCell className="py-2">EB</TableCell>
                                                    <TableCell className="py-2">01.01.2025 - 31.03.2025</TableCell>
                                                    <TableCell className="py-2">Tümü</TableCell>
                                                    <TableCell className="py-2">%10</TableCell>
                                                    <TableCell className="py-2">Hayır</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="yetkililer" className="p-6 overflow-y-auto m-0 flex-1">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold text-sm text-gray-700">Acente Yetkilileri</h3>
                                        <Button size="sm" className="h-7 text-xs bg-blue-600 text-white"><FaPlus className="mr-1" /> Yeni Ekle</Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="border p-3 rounded-md bg-white relative group hover:shadow-md transition-all">
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-2">
                                                <button className="text-gray-400 hover:text-blue-600"><FaEdit /></button>
                                                <button className="text-gray-400 hover:text-red-600"><FaTrash /></button>
                                            </div>
                                            <h4 className="text-sm font-bold text-gray-800">Ahmet Yılmaz</h4>
                                            <p className="text-xs text-gray-500 mb-2">Satış Müdürü</p>
                                            <div className="space-y-1 text-xs text-gray-600">
                                                <div className="flex items-center gap-2"><FaPhone className="text-gray-400" /> +90 555 123 45 67</div>
                                                <div className="flex items-center gap-2"><MdEmail className="text-gray-400" /> ahmet@acente.com</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="folio_routing" className="p-6 overflow-y-auto m-0 flex-1">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold text-sm text-gray-700">Folio Routing Kuralları</h3>
                                        <Button size="sm" className="h-7 text-xs bg-blue-600 text-white"><FaPlus className="mr-1" /> Yeni Ekle</Button>
                                    </div>
                                    <p className="text-xs text-gray-500">Bu acenteden gelen rezervasyonlar için harcamaların otomatik yönlendirilmesi.</p>
                                    <div className="border rounded-md bg-white">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-gray-50 hover:bg-gray-50">
                                                    <TableHead className="h-8 text-xs font-semibold text-gray-600">Departman</TableHead>
                                                    <TableHead className="h-8 text-xs font-semibold text-gray-600">İşlem</TableHead>
                                                    <TableHead className="h-8 text-xs font-semibold text-gray-600">Hedef Folio</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow className="text-xs">
                                                    <TableCell className="py-2">Konaklama (ROOM)</TableCell>
                                                    <TableCell className="py-2">Tümü</TableCell>
                                                    <TableCell className="py-2 border-l-4 border-green-500 pl-2">Master Folio (Acente)</TableCell>
                                                </TableRow>
                                                <TableRow className="text-xs">
                                                    <TableCell className="py-2">Extras</TableCell>
                                                    <TableCell className="py-2">Tümü</TableCell>
                                                    <TableCell className="py-2 border-l-4 border-blue-500 pl-2">Extra Folio (Misafir)</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </TabsContent>

                        </Tabs>

                        {/* Footer - Sits at bottom of right panel */}
                        <div className="p-3 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 flex justify-between items-center">
                            <span className="text-[10px] text-gray-400 font-mono">ID: {agencyId || 'NEW'} | Updated: {new Date().toLocaleDateString()}</span>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={onClose} className="h-8">Vazgeç</Button>
                                <Button size="sm" onClick={handleSubmit(onSubmit)} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 h-8">
                                    <FaSave /> Kaydet
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
