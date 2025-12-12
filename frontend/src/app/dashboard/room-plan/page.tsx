"use client";

import { useState, useEffect } from "react";
import RoomCard, { RoomStatus } from "@/components/rooms/RoomCard";
import RoomRackSidebar from "@/components/dashboard/room-plan/RoomRackSidebar";
import { FaSyncAlt, FaTh, FaList, FaQuestionCircle, FaCheck, FaCheckDouble } from "react-icons/fa";
import { roomService } from "@/lib/api";

// Mock Data specific to Room Rack testing
const mockRooms = [
    { number: "101", type: "STD", status: "VacantClean", bedType: "FRN" },
    { number: "102", type: "DLX", status: "VacantClean", bedType: "FRN", guestName: "Marcel Neal", pax: 2 }, // Screenshot has guest name on pink?? Actually 102 is pink.
    { number: "103", type: "STD", status: "VacantClean", bedType: "FRN" },
    { number: "104", type: "DLX", status: "VacantClean", bedType: "FRN" },
    { number: "105", type: "STD", status: "VacantClean", bedType: "FRN", guestName: "Isabella Katherine" },
    { number: "106", type: "FRN", status: "VacantClean", bedType: "FRN", guestName: "Cadence Damaris" },
    { number: "109", type: "STD", status: "Dirty", bedType: "FRN", isDirty: true }, // Red
    { number: "110", type: "DLX", status: "Occupied", bedType: "FRN", guestName: "Isabella Smith", pax: 2 },
    { number: "111", type: "STD", status: "VacantClean", bedType: "FRN", guestName: "Roy Wilson" },
    { number: "112", type: "DLX", status: "Occupied", bedType: "FRN", guestName: "Patrick Raymond" },
    { number: "113", type: "STD", status: "Occupied", bedType: "FRN", guestName: "Taylor Wilson" },
    { number: "114", type: "DLX", status: "Occupied", bedType: "FRN", guestName: "Williams Taylor" },
    { number: "117", type: "STD", status: "VacantClean", bedType: "FRN", guestName: "Adam Brock" },
    { number: "118", type: "DLX", status: "VacantClean", bedType: "FRN", guestName: "Edwin Gaven" },
    { number: "120", type: "DLX", status: "VacantClean", bedType: "FRN", guestName: "Kyle Lawrence" },
    { number: "125", type: "DLX", status: "VacantClean", bedType: "FRN", guestName: "Sebastian Terry" },
    { number: "201", type: "CON", status: "VacantClean", bedType: "FRN" },
    { number: "202", type: "JUNSUI", status: "VacantClean", bedType: "FRN", guestName: "Aslı Bucak" },
    { number: "301", type: "PNR", status: "Occupied", bedType: "KNG", guestName: "Walker Zachary", pax: 2 },
    { number: "301C", type: "CON", status: "Occupied", bedType: "KNG", pax: 2 },
    { number: "302", type: "PNR", status: "Occupied", bedType: "KNG" },
    { number: "303", type: "PNR", status: "Occupied", bedType: "KNG", guestName: "Bethany Brown" },
];

export default function RoomPlanPage() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [loading, setLoading] = useState(false); // Using mock data for visual match now
    const [rooms, setRooms] = useState<any[]>(mockRooms);

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-black/20">
            {/* Sidebar */}
            <RoomRackSidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Top Bar matching screenshot */}
                <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 p-2 flex items-center justify-between shadow-sm z-10">
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"><FaSyncAlt /></button>
                        <h1 className="text-xl font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                            <FaQuestionCircle className="text-gray-400 text-sm" /> Room Rack
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded">
                            <button className="p-1.5 rounded bg-white dark:bg-zinc-700 shadow-sm text-gray-600"><FaTh /></button>
                            <button className="p-1.5 rounded text-gray-400 hover:text-gray-600"><FaList /></button>
                        </div>
                        <div className="flex items-center bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded text-xs gap-2 text-gray-500">
                            <span>Durum</span>
                            <FaCheck />
                        </div>
                        <button className="p-1.5 border border-gray-300 rounded text-gray-500"><FaCheckDouble /></button>
                    </div>
                </div>

                {/* Grid Content */}
                <div className="flex-1 overflow-y-auto p-4 content-start">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                        {rooms.map((room) => (
                            <RoomCard
                                key={room.number}
                                roomNumber={room.number}
                                type={room.type}
                                status={room.status as RoomStatus}
                                guestName={room.guestName}
                                bedType={room.bedType}
                                pax={room.pax}
                                isDirty={room.isDirty}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
