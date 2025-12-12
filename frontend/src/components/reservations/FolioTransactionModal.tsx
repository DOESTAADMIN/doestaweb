"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { reservationService, roomService } from "@/lib/api";

interface FolioTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    reservationId: number;
    currency: string;
    onTransactionAdded: () => void;
}

export default function FolioTransactionModal({ isOpen, onClose, reservationId, currency, onTransactionAdded }: FolioTransactionModalProps) {
    const [type, setType] = useState<"debit" | "credit">("debit"); // debit=Harcama, credit=Ödeme
    const [amount, setAmount] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [department, setDepartment] = useState<string>("");
    const [revenueGroups, setRevenueGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Load types
            roomService.getRevenueGroups().then(setRevenueGroups).catch(console.error);
            // Default
            setDescription("");
            setAmount("");
            setType("debit");
        }
    }, [isOpen]);

    const handleSave = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            toast.error("Geçerli bir tutar giriniz.");
            return;
        }
        if (!description) {
            toast.error("Açıklama giriniz.");
            return;
        }

        setLoading(true);
        try {
            const val = parseFloat(amount);
            await reservationService.addFolioTransaction(reservationId, {
                description,
                debit: type === "debit" ? val : 0,
                credit: type === "credit" ? val : 0,
                departmentCode: department || (type === "debit" ? "EXTRA" : "CASH"),
                currency: currency
            });
            toast.success("İşlem başarıyla eklendi.");
            onTransactionAdded();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("İşlem eklenemedi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle>Folyo İşlemi Ekle</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {/* Type Selection */}
                    <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded">
                        <button
                            className={`py-2 text-sm font-bold rounded shadow-sm transition-all ${type === "debit" ? "bg-white text-red-600" : "text-gray-500 hover:text-gray-700"}`}
                            onClick={() => setType("debit")}
                        >
                            Harcama (Borç)
                        </button>
                        <button
                            className={`py-2 text-sm font-bold rounded shadow-sm transition-all ${type === "credit" ? "bg-white text-green-600" : "text-gray-500 hover:text-gray-700"}`}
                            onClick={() => setType("credit")}
                        >
                            Ödeme (Alacak)
                        </button>
                    </div>

                    {/* Department Select */}
                    <div>
                        <Label className="text-xs text-gray-500">Gelir Grubu / Departman</Label>
                        <select
                            className="w-full border border-gray-300 rounded p-2 text-sm outline-none focus:border-blue-500"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                        >
                            <option value="">Seçiniz</option>
                            {type === "debit" ? (
                                <>
                                    {revenueGroups.map(g => (
                                        <option key={g.id} value={g.code}>{g.name}</option>
                                    ))}
                                    <option value="MISC">Diğer Ekstra</option>
                                </>
                            ) : (
                                <>
                                    <option value="CASH">Nakit Tahsilat</option>
                                    <option value="CC">Kredi Kartı</option>
                                    <option value="BANK">Banka Havale</option>
                                </>
                            )}
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <Label className="text-xs text-gray-500">Açıklama</Label>
                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={type === "debit" ? "Örn: Mini Bar, Oda Servisi" : "Örn: Tahsilat"}
                        />
                    </div>

                    {/* Amount */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-xs text-gray-500">Tutar</Label>
                            <Input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                autoFocus
                            />
                        </div>
                        <div>
                            <Label className="text-xs text-gray-500">Döviz</Label>
                            <div className="p-2 border border-gray-200 bg-gray-50 rounded text-sm text-center font-bold text-gray-700">
                                {currency}
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>İptal</Button>
                    <Button onClick={handleSave} disabled={loading} className={`${type === "debit" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"} text-white`}>
                        {loading ? "Kaydediliyor..." : "Kaydet"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
