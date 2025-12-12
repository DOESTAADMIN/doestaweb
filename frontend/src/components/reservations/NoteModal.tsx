"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

interface NoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (note: string) => void;
}

export default function NoteModal({ isOpen, onClose, onSave }: NoteModalProps) {
    const [note, setNote] = useState("");

    const handleSave = () => {
        if (!note.trim()) {
            toast.error("Lütfen bir not giriniz.");
            return;
        }
        onSave(note);
        setNote("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>Yeni Not Ekle</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="note" className="text-left">
                            Notunuz
                        </Label>
                        <textarea
                            id="note"
                            className="w-full p-2 border rounded-md text-sm min-h-[100px] outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Notunuzu buraya giriniz..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>İptal</Button>
                    <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">Kaydet</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
