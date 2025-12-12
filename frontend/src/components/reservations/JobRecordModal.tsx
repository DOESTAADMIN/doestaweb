"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { X, Save, Printer, Lock, History, ChevronLeft, ChevronRight, Zap, Camera, Bell, Check, Play, Ban, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

import { toast } from "sonner";
import { reservationService } from "@/lib/api";

import { ReservationRequest } from "@/lib/api";

interface JobRecordModalProps {
    isOpen: boolean;
    onClose: () => void;
    reservationId?: string;
    reservationInfo?: string;
    initialData?: ReservationRequest | null;
    onSave?: () => void;
}

export default function JobRecordModal({ isOpen, onClose, reservationId, reservationInfo, onSave, initialData }: JobRecordModalProps) {
    const [formData, setFormData] = useState({
        job: "",
        description: "",
        department: "F.O",
        subDepartment: "",
        status: "New", // New, InProcess, Completed, Cancelled
        priority: "Normal",
        jobType: "Request",
        assignedTo: "",
        area: "",
        device: "",
    });

    // Reset or populate form when opening
    useEffect(() => {
        if (isOpen && initialData) {
            setFormData({
                job: initialData.title || "",
                description: initialData.description || "",
                department: initialData.department || "F.O",
                subDepartment: initialData.subDepartment || "",
                status: initialData.status || "New",
                priority: initialData.priority || "Normal",
                jobType: initialData.type || "Request",
                assignedTo: initialData.assignedTo || "",
                area: initialData.area || "",
                device: initialData.device || "",
            });
        } else if (isOpen) {
            // Reset to defaults for new 
            setFormData({
                job: "",
                description: "",
                department: "F.O",
                subDepartment: "",
                status: "New",
                priority: "Normal",
                jobType: "Request",
                assignedTo: "",
                area: "",
                device: "",
            });
        }
    }, [isOpen, initialData]);

    const handleSave = async () => {
        // Validation ...
        if (!formData.job) {
            toast.error("Lütfen bir iş başlığı giriniz.");
            return;
        }

        try {
            if (initialData && initialData.id) {
                // Update Existing
                await reservationService.updateRequest(initialData.id, {
                    ...initialData,
                    title: formData.job,
                    description: formData.description,
                    status: formData.status,
                    department: formData.department,
                    subDepartment: formData.subDepartment,
                    type: formData.jobType,
                    priority: formData.priority,
                    assignedTo: formData.assignedTo,
                    area: formData.area,
                    device: formData.device,
                });
                toast.success("Görev güncellendi.");
            } else {
                // Create New
                if (!reservationId) {
                    toast.error("Rezervasyon ID bulunamadı.");
                    return;
                }
                await reservationService.addRequest(parseInt(reservationId), {
                    title: formData.job,
                    description: formData.description,
                    status: formData.status,
                    department: formData.department,
                    subDepartment: formData.subDepartment,
                    type: formData.jobType,
                    priority: formData.priority,
                    assignedTo: formData.assignedTo,
                    area: formData.area,
                    device: formData.device,
                    createdBy: "User" // TODO: Get real user
                });
                toast.success("Görev oluşturuldu.");
            }
            onSave?.();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("İşlem sırasında hata oluştu.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl bg-white p-0 gap-0 overflow-hidden h-[90vh] flex flex-col">
                {/* HEADER / TOOLBAR */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <DialogTitle className="text-lg font-bold text-blue-900">İş Kaydı</DialogTitle>
                            <button className="text-gray-500 hover:text-gray-700"><History size={18} /></button>
                        </div>
                        <div className="h-6 w-px bg-gray-300"></div>
                        <div className="flex items-center gap-1">
                            <button className="p-1 text-gray-500 hover:text-gray-700"><div className="border border-gray-400 rounded-sm w-4 h-5 relative"><span className="absolute top-0 right-0 -mt-1 -mr-1 text-[10px] font-bold">+</span></div></button>
                            <button onClick={handleSave} className="p-1 text-gray-500 hover:text-blue-700" title="Kaydet"><Save size={18} /></button>
                            <button className="p-1 text-gray-500 hover:text-gray-700"><Printer size={18} /></button>
                            <button className="p-1 text-gray-500 hover:text-gray-700"><Lock size={18} /></button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handleSave} className="p-1 hover:bg-green-50 rounded"><Check className="text-blue-600" size={24} /></button>
                        <button onClick={onClose} className="p-1 hover:bg-red-50 rounded"><X className="text-red-500" size={24} /></button>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* LEFT PANEL - PHOTOS */}
                    <div className="w-1/4 bg-gray-50 p-4 border-r border-gray-200 flex flex-col gap-4 overflow-y-auto">
                        <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-300 transition-colors">
                            <div className="text-center">
                                <Camera size={48} className="text-gray-400 mx-auto" />
                                <span className="text-xs text-gray-500">Fotoğraf Ekle</span>
                            </div>
                        </div>

                        <div className="mt-auto space-y-2 text-xs text-gray-500">
                            <div className="flex justify-between">
                                <span>Oluşturulma Tarihi</span>
                            </div>
                            <div className="flex justify-between font-bold text-gray-700">
                                <span>{new Date().toLocaleDateString()}</span>
                                <span>{new Date().toLocaleTimeString().slice(0, 5)}</span>
                            </div>
                            <div className="border-t border-gray-300 my-2"></div>
                            <div className="flex justify-between items-center">
                                <span>Oluşturan</span>
                                <span>Sistem</span>
                                <MoreHorizontalIcon />
                            </div>
                        </div>
                    </div>

                    {/* MIDDLE PANEL - FORM */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        <div className="space-y-4">
                            {/* Job Select */}
                            <div className="flex items-center gap-2">
                                <Label className="w-24 text-gray-500 text-xs">İş *</Label>
                                <div className="flex-1 flex items-center gap-2 border-b border-gray-300 py-1">
                                    <input
                                        className="w-full outline-none text-sm"
                                        placeholder="Başlık..."
                                        value={formData.job}
                                        onChange={(e) => setFormData({ ...formData, job: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <Label className="block text-gray-500 text-xs mb-1">Açıklama</Label>
                                <textarea
                                    className="w-full border-b border-gray-300 py-1 outline-none text-sm resize-none h-16 bg-transparent focus:border-blue-500 transition-colors"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Detaylı açıklama giriniz..."
                                />
                            </div>

                            {/* Res Info */}
                            <div className="bg-blue-50 p-2 rounded text-xs text-blue-900 border border-blue-100 flex items-center justify-between">
                                <div>
                                    <span className="text-blue-400 block text-[10px]">Rez Bilgi</span>
                                    <span className="font-bold">{reservationInfo || "Rezervasyon Bilgisi Yok"}</span>
                                </div>
                                <div className="flex items-center gap-1 text-blue-500">
                                    <span>#{reservationId}</span>
                                </div>
                            </div>

                            {/* Department / SubDepartment */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <Label className="w-24 text-gray-500 text-xs">Departman</Label>
                                    <div className="flex-1 border-b border-gray-300 py-1">
                                        <select
                                            className="w-full outline-none text-sm bg-transparent"
                                            value={formData.department}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        >
                                            <option value="F.O">Front Office</option>
                                            <option value="HK">Housekeeping</option>
                                            <option value="F&B">Food & Beverage</option>
                                            <option value="TECH">Technical</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label className="w-24 text-gray-500 text-xs">Alt Dept.</Label>
                                    <div className="flex-1 border-b border-gray-300 py-1">
                                        <input
                                            className="w-full outline-none text-sm"
                                            value={formData.subDepartment}
                                            onChange={(e) => setFormData({ ...formData, subDepartment: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Assigned To */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="block text-gray-500 text-xs mb-1">Görevlendirilen</Label>
                                    <input
                                        className="w-full border-b border-gray-300 py-1 outline-none text-sm"
                                        value={formData.assignedTo}
                                        onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                                        placeholder="Personel Adı"
                                    />
                                </div>
                            </div>

                            {/* Device / Date */}
                            <div className="grid grid-cols-2 gap-4 items-end">
                                <div>
                                    <Label className="block text-gray-500 text-xs mb-1">Cihaz</Label>
                                    <div className="flex items-center border-b border-gray-300 py-1">
                                        <input
                                            className="flex-1 outline-none text-sm"
                                            value={formData.device}
                                            onChange={(e) => setFormData({ ...formData, device: e.target.value })}
                                        />
                                        <span className="text-gray-400 text-xs">🔍</span>
                                    </div>
                                </div>
                                <div>
                                    <Label className="block text-gray-500 text-[10px] mb-1">Tarih</Label>
                                    <div className="flex items-center justify-between border-b border-gray-300 py-1">
                                        <span className="font-bold text-sm">{new Date().toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Type / Source */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="block text-gray-500 text-xs mb-1">Görev Türü</Label>
                                    <select
                                        className="w-full border-b border-gray-300 py-1 bg-transparent outline-none text-sm"
                                        value={formData.jobType}
                                        onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                                    >
                                        <option value="Request">İstek</option>
                                        <option value="Complaint">Şikayet</option>
                                        <option value="Task">Görev</option>
                                    </select>
                                </div>
                            </div>

                            {/* Area / Priority */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="block text-gray-500 text-xs mb-1">Alan</Label>
                                    <input
                                        className="w-full border-b border-gray-300 py-1 outline-none text-sm"
                                        value={formData.area}
                                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label className="block text-gray-500 text-xs mb-1">Önem</Label>
                                    <select
                                        className="w-full border-b border-gray-300 py-1 bg-transparent outline-none text-sm"
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    >
                                        <option value="Low">Düşük</option>
                                        <option value="Normal">Normal</option>
                                        <option value="High">Yüksek</option>
                                        <option value="Urgent">Acil</option>
                                    </select>
                                </div>
                            </div>

                            <Button onClick={handleSave} className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold h-12 mt-4 text-base shadow-lg transition-all">
                                <Save className="mr-2" size={20} /> Kaydet ve Kapat
                            </Button>
                        </div>
                    </div>

                    {/* RIGHT PANEL - STATUS */}
                    <div className="w-1/3 bg-white p-6 border-l border-gray-200 flex flex-col justify-between">
                        <div className="space-y-6">
                            <div>
                                <Label className="block text-gray-400 text-xs mb-1">Durum</Label>
                                <div className="flex items-center justify-between border-b border-gray-300 py-1">
                                    <span className={`text-sm font-bold ${formData.status === 'New' ? 'text-blue-600' :
                                        formData.status === 'InProcess' ? 'text-orange-600' :
                                            formData.status === 'Completed' ? 'text-green-600' : 'text-gray-600'
                                        }`}>
                                        {formData.status === 'New' ? 'Yeni' :
                                            formData.status === 'InProcess' ? 'İşlemde' :
                                                formData.status === 'Completed' ? 'Tamamlandı' : formData.status}
                                    </span>
                                </div>
                            </div>

                            {formData.status === 'New' && (
                                <Button
                                    onClick={() => setFormData({ ...formData, status: 'InProcess' })}
                                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold h-10"
                                >
                                    <Play className="mr-2" size={16} fill="white" /> Göreve Başla
                                </Button>
                            )}

                            {formData.status === 'InProcess' && (
                                <Button
                                    onClick={() => setFormData({ ...formData, status: 'Completed' })}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-10"
                                >
                                    <Check className="mr-2" size={16} /> Görevi Tamamla
                                </Button>
                            )}

                            {formData.status === 'Completed' && (
                                <div className="bg-green-50 p-4 rounded text-center text-green-700 font-bold border border-green-200">
                                    Görev Tamamlandı
                                </div>
                            )}

                            <Button
                                variant="outline"
                                onClick={() => setFormData({ ...formData, status: 'Cancelled' })}
                                className="w-full border-red-200 text-red-600 hover:bg-red-50 font-bold h-10 mt-4"
                            >
                                <Ban className="mr-2" size={16} /> İptal Et
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function MoreHorizontalIcon() {
    return <span className="text-gray-400 text-xs">•••</span>
}
