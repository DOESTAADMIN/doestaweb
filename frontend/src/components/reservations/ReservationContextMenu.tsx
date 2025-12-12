"use client";

import { useRef, useEffect } from "react";
import {
    FaCheck, FaTimes, FaMoneyBillWave, FaFileInvoiceDollar, FaKey, FaTrash,
    FaBroom, FaShareAlt, FaUserPlus, FaBed, FaListUl, FaUndo, FaLock, FaLockOpen
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

interface ReservationContextMenuProps {
    x: number;
    y: number;
    reservationId: string;
    onClose: () => void;
    onAction: (action: string, id: string) => void;
}

export default function ReservationContextMenu({ x, y, reservationId, onClose, onAction }: ReservationContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    // Adjust position if close to screen edge
    const style = {
        top: y,
        left: x,
    };

    if (typeof window !== 'undefined') {
        if (x + 300 > window.innerWidth) style.left = x - 300;
        if (y + 400 > window.innerHeight) style.top = y - 400;
    }

    return (
        <div
            ref={menuRef}
            className="fixed z-[100] bg-white dark:bg-zinc-800 shadow-2xl rounded-lg border border-gray-200 dark:border-gray-700 w-72 text-sm p-1 animate-in fade-in zoom-in-95 duration-100"
            style={style}
        >
            <div className="grid grid-cols-2 gap-x-1 gap-y-0.5">
                {/* Column 1 */}
                <div className="flex flex-col gap-0.5 border-r border-gray-100 dark:border-gray-700 pr-1">
                    <MenuItem icon={<FaCheck className="text-green-600" />} label="Check-In" onClick={() => onAction('checkin', reservationId)} />
                    <MenuItem icon={<FaListUl />} label="Boş Oda Listesinden Seç" onClick={() => onAction('select_room', reservationId)} />
                    <MenuItem icon={<FaShareAlt />} label="Böl" onClick={() => onAction('split', reservationId)} />
                    <MenuItem icon={<FaShareAlt />} label="Share ile Böl" onClick={() => onAction('split_share', reservationId)} />
                    <MenuItem icon={<FaUserPlus />} label="Share Rez. Oluştur" onClick={() => onAction('create_share', reservationId)} />
                    <MenuItem icon={<FaUndo />} label="Kuyruğa Al" onClick={() => onAction('queue', reservationId)} />
                    <MenuItem icon={<FaTimes />} label="Kuyruk İptali" onClick={() => onAction('cancel_queue', reservationId)} />
                    <MenuItem icon={<FaBed />} label="Sanal Folyo" onClick={() => onAction('virtual_folio', reservationId)} />
                </div>

                {/* Column 2 */}
                <div className="flex flex-col gap-0.5 pl-1">
                    <MenuItem icon={<FaTimes className="text-red-600" />} label="Rezervasyon İptali" onClick={() => onAction('cancel', reservationId)} />
                    <MenuItem icon={<FaUndo />} label="Bekleme Listesine Geri Al" onClick={() => onAction('waitlist', reservationId)} />
                    <MenuItem icon={<FaTimes />} label="NoShow" onClick={() => onAction('noshow', reservationId)} />
                    <MenuItem icon={<FaTrash className="text-red-500" />} label="Rezervasyonu Sil" onClick={() => onAction('delete', reservationId)} />
                    <MenuItem icon={<FaBroom />} label="Oda No Temizle" onClick={() => onAction('clear_room', reservationId)} />
                    <MenuItem icon={<FaBed />} label="Oda Tipi Müsaitlik" onClick={() => onAction('availability', reservationId)} />
                    <MenuItem icon={<FaUserPlus />} label="Ana Folyoya Bağla" onClick={() => onAction('link_folio', reservationId)} />
                    <MenuItem icon={<FaShareAlt />} label="Share Olarak Bağla" onClick={() => onAction('link_share', reservationId)} />
                </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 my-1 mx-2"></div>

            <div className="grid grid-cols-2 gap-x-1 gap-y-0.5">
                {/* Financials */}
                <div className="flex flex-col gap-0.5 pr-1 border-r border-gray-100 dark:border-gray-700">
                    <MenuItem icon={<FaMoneyBillWave className="text-green-600" />} label="Ödeme" onClick={() => onAction('payment', reservationId)} />
                    <MenuItem icon={<FaFileInvoiceDollar />} label="Fatura Kes" onClick={() => onAction('invoice', reservationId)} />
                    <MenuItem icon={<FaLock className="text-amber-500" />} label="Folyoyu Kilitle" onClick={() => onAction('lock_folio', reservationId)} />
                    <MenuItem icon={<FaLockOpen />} label="Folyo Kilidini Aç" onClick={() => onAction('unlock_folio', reservationId)} />
                </div>
                <div className="flex flex-col gap-0.5 pl-1">
                    <MenuItem icon={<FaKey />} label="Oda Ver" onClick={() => onAction('assign_room', reservationId)} />
                </div>
            </div>
        </div>
    );
}

function MenuItem({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 w-full text-left px-2 py-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 rounded transition-colors"
        >
            <span className="text-sm w-4 flex justify-center">{icon}</span>
            <span className="truncate font-medium text-[11px]">{label}</span>
        </button>
    );
}
