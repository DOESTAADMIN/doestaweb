import { FaBed, FaBroom, FaTools, FaUser, FaCheck, FaPlus, FaEllipsisV, FaChevronLeft, FaChevronRight, FaUserFriends, FaRegSquare, FaCheckSquare, FaChevronDown } from "react-icons/fa";
import { cn } from "@/lib/utils";

export type RoomStatus = "VacantClean" | "Occupied" | "Dirty" | "Maintenance" | "Reserved";

export interface RoomProps {
    roomNumber: string;
    type: string;
    bedType?: string;
    status: RoomStatus;
    guestName?: string;
    pax?: number;
    isSelected?: boolean;
    isDirty?: boolean;
    onStatusToggle?: (e: React.MouseEvent) => void;
    onQuickReserve?: (e: React.MouseEvent) => void;
    onClick?: () => void;
    onSelect?: (e: React.MouseEvent) => void;
    onMenuClick?: (e: React.MouseEvent) => void;
}

export default function RoomCard({ roomNumber, type, bedType = "FRN", status, guestName, pax, isSelected, isDirty, onStatusToggle, onQuickReserve, onClick, onSelect, onMenuClick }: RoomProps) {

    // Determine card styles based on status
    const isOccupied = status === "Occupied";
    const isClean = !isDirty && (status === "VacantClean" || status === "Occupied");

    const headerBorderColor = isDirty ? "border-red-500" : (isClean ? "border-green-500" : "border-gray-300");
    const statusTextColor = isDirty ? "text-red-500" : (isClean ? "text-green-600" : "text-gray-500");
    const numberColor = isDirty ? "text-white bg-red-600 px-2 rounded" : "text-sky-500";

    return (
        <div className={cn("bg-white dark:bg-zinc-900 border rounded shadow-sm hover:shadow-md transition-shadow flex flex-col h-32 relative overflow-hidden group select-none", isSelected ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-200 dark:border-zinc-800")}>
            {/* Header */}
            <div className={`flex items-center justify-between px-2 py-1 border-b border-gray-100 dark:border-zinc-800 text-[10px] ${statusTextColor}`}>
                <div
                    className="flex items-center gap-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 rounded px-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        onStatusToggle?.(e);
                    }}
                >
                    <span className="font-semibold">{isDirty ? "Kirli" : "Temiz"}</span>
                    <FaChevronDown size={8} />
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                    <div
                        className="cursor-pointer hover:text-gray-600 p-0.5"
                        onClick={(e) => {
                            e.stopPropagation();
                            onMenuClick?.(e);
                        }}
                    >
                        <FaEllipsisV size={10} />
                    </div>
                    <div
                        className="cursor-pointer hover:text-blue-500 p-0.5"
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect?.(e);
                        }}
                    >
                        {isSelected ? <FaCheckSquare className="text-blue-500" size={12} /> : <FaRegSquare size={12} />}
                    </div>
                </div>
            </div>

            {/* Body */}
            <div
                className="flex-1 flex flex-col items-center justify-center relative cursor-pointer"
                onClick={onClick}
            >
                <div className="w-full flex justify-between px-2 absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <button className="text-gray-300 hover:text-gray-500 pointer-events-auto"><FaChevronLeft size={10} /></button>
                    <button className="text-gray-300 hover:text-gray-500 pointer-events-auto"><FaChevronRight size={10} /></button>
                </div>

                <div className={cn("text-3xl font-bold mb-1", numberColor)}>
                    {roomNumber}
                </div>
                <div className="flex flex-col items-center text-[9px] text-gray-400 uppercase leading-tight">
                    <span className="text-sky-400 font-bold">{bedType}</span>
                    <span>{type}</span>
                </div>
            </div>

            {/* Footer */}
            <div className="px-2 py-1.5 bg-gray-50 dark:bg-zinc-800/50 border-t border-gray-100 dark:border-zinc-800 min-h-[32px] flex items-center justify-center">
                {isOccupied && guestName ? (
                    <div className="flex flex-col items-center leading-none">
                        <span className="text-[10px] text-gray-600 dark:text-gray-300 font-medium truncate max-w-[100px]">{guestName}</span>
                        <span className="text-[9px] text-gray-400 flex items-center gap-1 mt-0.5"><FaUserFriends size={8} /> {pax || 2}</span>
                    </div>
                ) : (
                    <button
                        className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all p-1.5 rounded-full"
                        onClick={(e) => {
                            e.stopPropagation();
                            onQuickReserve?.(e);
                        }}
                        title="Hızlı Rezervasyon Ekle"
                    >
                        <FaPlus size={14} />
                    </button>
                )}
            </div>
        </div>
    );
}

