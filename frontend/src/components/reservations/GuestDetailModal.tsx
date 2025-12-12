"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/Select";
import { useState, useEffect } from "react";
import { ReservationGuest } from "@/lib/api";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { toast } from "sonner";

interface GuestDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (guest: any) => void;
    initialData?: any; // Partial<ReservationGuest> + extra fields
}

export default function GuestDetailModal({ isOpen, onClose, onSave, initialData }: GuestDetailModalProps) {
    const [formData, setFormData] = useState<any>({
        firstName: "",
        lastName: "",
        middleName: "", // New
        title: "", // Unvan
        gender: "",
        nationality: "TR",
        birthPlace: "",
        birthDate: "",
        age: "",
        phone: "",
        email: "",
        idNumber: "", // TC No
        idValidDate: "",
        idIssueDate: "",
        passportNo: "",
        passportValidDate: "",
        passportIssueDate: "",
        carPlate: "",
        cardNo: "",
        isBlacklist: false,
        kvkkConsent: false,
        phoneContact: false,
        emailContact: false,
        ...initialData
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                firstName: "",
                lastName: "",
                middleName: "",
                title: "",
                gender: "",
                nationality: "TR",
                birthPlace: "",
                birthDate: "",
                age: "",
                phone: "",
                email: "",
                idNumber: "",
                idValidDate: "",
                idIssueDate: "",
                passportNo: "",
                passportValidDate: "",
                passportIssueDate: "",
                carPlate: "",
                cardNo: "",
                isBlacklist: false,
                kvkkConsent: false,
                phoneContact: false,
                emailContact: false,
                ...initialData
            });
        }
    }, [isOpen, initialData]);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = (andNew: boolean = false) => {
        if (!formData.firstName || !formData.lastName) {
            toast.error("Ad ve Soyad zorunludur.");
            return;
        }

        // Prepare object for save (map back to what API expects if needed, or pass full object for local state)
        // For now pass full object, parent component handles API mapping
        onSave(formData);

        if (andNew) {
            setFormData({
                // Reset fields
                firstName: "", lastName: "", middleName: "", title: "", gender: "", nationality: "TR",
                birthPlace: "", birthDate: "", age: "", phone: "", email: "", idNumber: "",
                idValidDate: "", idIssueDate: "", passportNo: "", passportValidDate: "", passportIssueDate: "",
                carPlate: "", cardNo: "", isBlacklist: false, kvkkConsent: false, phoneContact: false, emailContact: false
            });
            toast.success("Misafir kaydedildi, yeni kayıt bekleniyor.");
        } else {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl p-0 gap-0 bg-gray-50 dark:bg-zinc-900 overflow-hidden">
                {/* Header - Not explicitly shown in design but good for UX */}
                <div className="bg-white dark:bg-zinc-900 border-b p-4 flex justify-between items-center hidden">
                    <DialogTitle>Misafir Kartı</DialogTitle>
                </div>

                <div className="p-6 space-y-4">
                    {/* Search Bar Row */}
                    <div className="relative">
                        <Label className="text-xs text-gray-500 mb-1 block">Misafir Kontrol</Label>
                        <Input
                            className="bg-white border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 focus-visible:border-blue-500 px-0 shadow-none"
                            placeholder="Misafir Ara..."
                        />
                    </div>

                    {/* First Row: Name details */}
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-2">
                            <Label className="text-xs text-gray-500">Unvan</Label>
                            <Input
                                className="h-8 bg-transparent border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0 shadow-none"
                                value={formData.title} onChange={e => handleChange('title', e.target.value)}
                            />
                        </div>
                        <div className="col-span-2">
                            <Label className="text-xs text-gray-500">Cinsiyeti</Label>
                            <Select
                                className="h-8 bg-transparent border-0 border-b border-gray-300 rounded-none focus:ring-0 px-0 shadow-none pt-0 pb-0"
                                value={formData.gender}
                                onChange={(e) => handleChange('gender', e.target.value)}
                                options={[
                                    { label: 'Seçiniz', value: '' },
                                    { label: 'Erkek', value: 'M' },
                                    { label: 'Kadın', value: 'F' }
                                ]}
                            />
                        </div>
                        <div className="col-span-3">
                            <Label className="text-xs text-gray-500">Ad *</Label>
                            <Input
                                className="h-8 bg-transparent border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0 shadow-none font-semibold"
                                value={formData.firstName} onChange={e => handleChange('firstName', e.target.value)}
                            />
                        </div>
                        <div className="col-span-2">
                            <Label className="text-xs text-gray-500">Orta Ad</Label>
                            <Input
                                className="h-8 bg-transparent border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0 shadow-none"
                                value={formData.middleName} onChange={e => handleChange('middleName', e.target.value)}
                            />
                        </div>
                        <div className="col-span-3">
                            <Label className="text-xs text-gray-500">Soyad *</Label>
                            <Input
                                className="h-8 bg-transparent border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0 shadow-none font-semibold"
                                value={formData.lastName} onChange={e => handleChange('lastName', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Second Row: Demographics */}
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-2">
                            <Label className="text-xs text-gray-500">Uyruk</Label>
                            <Input
                                className="h-8 bg-transparent border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0 shadow-none"
                                value={formData.nationality} onChange={e => handleChange('nationality', e.target.value)}
                            />
                        </div>
                        <div className="col-span-3">
                            <Label className="text-xs text-gray-500">Doğum Yeri</Label>
                            <Input
                                className="h-8 bg-transparent border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0 shadow-none"
                                value={formData.birthPlace} onChange={e => handleChange('birthPlace', e.target.value)}
                            />
                        </div>
                        <div className="col-span-1">
                            <Label className="text-xs text-gray-500">Yaş</Label>
                            <Input
                                className="h-8 bg-transparent border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0 shadow-none"
                                value={formData.age} onChange={e => handleChange('age', e.target.value)}
                            />
                        </div>
                        <div className="col-span-3">
                            <Label className="text-xs text-gray-500">Doğum Tarihi</Label>
                            <Input
                                type="date"
                                className="h-8 bg-transparent border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0 shadow-none block w-full"
                                value={formData.birthDate?.split('T')[0]} onChange={e => handleChange('birthDate', e.target.value)}
                            />
                        </div>
                        <div className="col-span-3">
                            <Label className="text-xs text-gray-500">Telefon</Label>
                            <Input value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="Telefon" className="h-8 bg-transparent border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0 shadow-none" />
                        </div>
                    </div>
                    {/* Row: Email (merged into prev row in design but separate here for space) */}
                    <div className="grid grid-cols-1">
                        <div className="col-span-1">
                            <Label className="text-xs text-gray-500">E-mail</Label>
                            <Input
                                className="h-8 bg-transparent border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0 shadow-none"
                                value={formData.email} onChange={e => handleChange('email', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Third Row: ID Card */}
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-4">
                            <Label className="text-xs text-gray-500">TC No</Label>
                            <Input value={formData.idNumber} onChange={(e) => handleChange('idNumber', e.target.value)} placeholder="TC Kimlik No" className="h-8 bg-transparent border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0 shadow-none" />
                        </div>
                        <div className="col-span-4">
                            <Label className="text-xs text-gray-500">Kimlik Geçerlilik Tarihi</Label>
                            <Input
                                type="date"
                                className="h-8 bg-transparent border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0 shadow-none block w-full"
                                value={formData.idValidDate} onChange={e => handleChange('idValidDate', e.target.value)}
                            />
                        </div>
                        <div className="col-span-4">
                            <Label className="text-xs text-gray-500">Kimlik Veriliş Tarihi</Label>
                            <Input
                                type="date"
                                className="h-8 bg-transparent border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0 shadow-none block w-full"
                                value={formData.idIssueDate} onChange={e => handleChange('idIssueDate', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Fourth Row: Passport */}
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-4">
                            <Label className="text-xs text-gray-500">Passport No</Label>
                            <Input
                                className="h-8 bg-transparent border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0 shadow-none"
                                value={formData.passportNo} onChange={e => handleChange('passportNo', e.target.value)}
                            />
                        </div>
                        <div className="col-span-4">
                            <Label className="text-xs text-gray-500">Passport Geçerlilik Tarihi</Label>
                            <Input
                                type="date"
                                className="h-8 bg-transparent border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0 shadow-none block w-full"
                                value={formData.passportValidDate} onChange={e => handleChange('passportValidDate', e.target.value)}
                            />
                        </div>
                        <div className="col-span-4">
                            <Label className="text-xs text-gray-500">Pasaport Düzenlenme Tarihi</Label>
                            <Input
                                type="date"
                                className="h-8 bg-transparent border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0 shadow-none block w-full"
                                value={formData.passportIssueDate} onChange={e => handleChange('passportIssueDate', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Fifth Row: Other + Checkboxes */}
                    <div className="grid grid-cols-12 gap-4 items-center mt-4">
                        <div className="col-span-3">
                            <Label className="text-xs text-gray-500">Araç Plakası</Label>
                            <Input
                                className="h-8 bg-transparent border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0 shadow-none"
                                value={formData.carPlate} onChange={e => handleChange('carPlate', e.target.value)}
                            />
                        </div>
                        <div className="col-span-3">
                            <Label className="text-xs text-gray-500">Kart No</Label>
                            <Input
                                className="h-8 bg-transparent border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0 shadow-none"
                                value={formData.cardNo} onChange={e => handleChange('cardNo', e.target.value)}
                            />
                        </div>

                        <div className="col-span-6 flex items-center justify-end gap-3">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="blacklist" checked={formData.isBlacklist} onCheckedChange={c => handleChange('isBlacklist', c)} />
                                <Label htmlFor="blacklist" className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Kara Liste</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="kvkk" checked={formData.kvkkConsent} onCheckedChange={c => handleChange('kvkkConsent', c)} />
                                <Label htmlFor="kvkk" className="text-xs font-medium leading-none">KVKK Onayı</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="phoneContact" checked={formData.phoneContact} onCheckedChange={c => handleChange('phoneContact', c)} />
                                <Label htmlFor="phoneContact" className="text-xs font-medium leading-none">Telefon Ulaşımı</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="emailContact" checked={formData.emailContact} onCheckedChange={c => handleChange('emailContact', c)} />
                                <Label htmlFor="emailContact" className="text-xs font-medium leading-none">EMail Ulaşımı</Label>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="bg-white dark:bg-zinc-900 border-t p-4 flex justify-center items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronLeft size={16} /></Button>

                    <div className="flex gap-2">
                        <Button className="bg-blue-800 hover:bg-blue-900 text-white h-9 px-6 text-sm" onClick={() => handleSave(false)}>Kaydet</Button>
                        <Button className="bg-blue-800 hover:bg-blue-900 text-white h-9 px-6 text-sm" onClick={() => handleSave(true)}>Kaydet & Yeni</Button>
                        <Button variant="destructive" className="h-9 px-6 text-sm" onClick={onClose}>Kapat</Button>
                    </div>

                    <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronRight size={16} /></Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
