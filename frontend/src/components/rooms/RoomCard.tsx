import { FaBed, FaBroom, FaTools, FaUser, FaCheck, FaPlus, FaEllipsisV, FaChevronLeft, FaChevronRight, FaUserFriends, FaRegSquare, FaCheckSquare } from "react-icons/fa";
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
    isDirty?: boolean; // Additional flag to force "Dirty" styling regardless of status logic if needed
}

export default function RoomCard({ roomNumber, type, bedType = "FRN", status, guestName, pax, isSelected, isDirty }: RoomProps) {

    // Determine card styles based on status
    const isOccupied = status === "Occupied";
    const isClean = !isDirty && (status === "VacantClean" || status === "Occupied"); // Simplification

    // Header Color (Greenish for Clean, Red/Orange for Dirty/Occupied logic?)
    // Screenshot shows: 
    // - Vacant/Clean (101): Header White? No, header seems light gray with "Temiz".
    // - Occupied (110): Green text "Temiz"
    // - Dirty (109): Red background/text.

    // Let's approximate the screenshot's clean look
    const headerBorderColor = isDirty ? "border-red-500" : (isClean ? "border-green-500" : "border-gray-300");
    const statusTextColor = isDirty ? "text-red-500" : (isClean ? "text-green-600" : "text-gray-500");

    // Room Number Color
    // 109 (Dirty) is White on Red BG? in screenshot it's Red BG with white text maybe. 
    // Actually screenshot 109 has Red Box around it.

    const numberColor = isDirty ? "text-white bg-red-600 px-2 rounded" : "text-sky-500";

    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded shadow-sm hover:shadow-md transition-shadow flex flex-col h-32 relative overflow-hidden group">
            {/* Left Colored Stripe if needed, or Top Border */}
            {/* Header */}
            <div className={`flex items-center justify-between px-2 py-1 border-b border-gray-100 dark:border-zinc-800 text-[10px] ${statusTextColor}`}>
                <div className="flex items-center gap-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 rounded px-1">
                    <span className="font-semibold">{isDirty ? "Kirli" : "Temiz"}</span>
                    <FaChevronDown size={8} />  {/* Renamed icon usage, define FaChevronDown below or import */}
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                    <FaEllipsisV className="cursor-pointer hover:text-gray-600" size={10} />
                    {isSelected ? <FaCheckSquare className="text-blue-500" size={12} /> : <FaRegSquare size={12} />}
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 flex flex-col items-center justify-center relative">
                <div className="w-full flex justify-between px-2 absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-gray-300 hover:text-gray-500"><FaChevronLeft size={10} /></button>
                    <button className="text-gray-300 hover:text-gray-500"><FaChevronRight size={10} /></button>
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
            <div className="px-2 py-1.5 bg-gray-50 dark:bg-zinc-800/50 border-t border-gray-100 dark:border-zinc-800 min-h-[28px] flex items-center justify-center">
                {isOccupied && guestName ? (
                    <div className="flex flex-col items-center leading-none">
                        <span className="text-[10px] text-gray-600 dark:text-gray-300 font-medium truncate max-w-[100px]">{guestName}</span>
                        <span className="text-[9px] text-gray-400 flex items-center gap-1 mt-0.5"><FaUserFriends size={8} /> {pax || 2}</span>
                    </div>
                ) : (
                    <button className="text-gray-400 hover:text-blue-600 transition-colors">
                        <FaPlus size={12} />
                    </button>
                )}
            </div>
        </div>
    );
}

// Temporary Icon Local Definition if import fails, but standard imports used above.
import { FaChevronDown } from "react-icons/fa";

