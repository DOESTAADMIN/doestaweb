"use client";

import { useState, useRef, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaPlus, FaBroom, FaBan, FaConciergeBell, FaCheck, FaMoneyBillWave, FaTrash } from "react-icons/fa";
import { cn } from "@/lib/utils";
import ReservationModal from "@/components/reservations/ReservationModal";

// Mock Data for Timeline
const ROOMS = [
    { id: "101", type: "STD", floor: 1 },
    { id: "102", type: "STD", floor: 1 },
    { id: "103", type: "DLX", floor: 1 },
    { id: "201", type: "STD", floor: 2 },
    { id: "202", type: "DLX", floor: 2 },
    { id: "203", type: "STE", floor: 2 },
];

const RESERVATIONS = [
    { id: "RES-1", roomId: "101", guest: "Ahmet Y.", start: "2024-12-01", end: "2024-12-05", status: "Occupied", color: "bg-red-500" },
    { id: "RES-2", roomId: "102", guest: "Mehmet D.", start: "2024-12-03", end: "2024-12-07", status: "Occupied", color: "bg-blue-500" },
    { id: "RES-3", roomId: "203", guest: "VIP Guest", start: "2024-12-02", end: "2024-12-10", status: "Reserved", color: "bg-green-500" },
    { id: "RES-4", roomId: "103", guest: "Ayşe K.", start: "2024-12-06", end: "2024-12-08", status: "Reserved", color: "bg-orange-500" },
];

const CELL_WIDTH = 60; // Pixels per day

interface ContextMenuPos {
    x: number;
    y: number;
    reservationId?: string;
    roomId?: string;
}

export default function TimelineView() {
    const [currentDate, setCurrentDate] = useState(new Date("2024-12-01"));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRes, setSelectedRes] = useState<any>(null);
    const [contextMenu, setContextMenu] = useState<ContextMenuPos | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Close menu on click elsewhere
    useEffect(() => {
        const handleClick = () => setContextMenu(null);
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    // State for interactive data
    const [reservationsState, setReservationsState] = useState(RESERVATIONS);
    const [roomsState, setRoomsState] = useState(ROOMS);

    // Filter logic states
    const [filterType, setFilterType] = useState<string | null>(null);
    const [filterFloor, setFilterFloor] = useState<number | null>(null);

    // Action Handlers
    const handleAction = (action: string, payload?: any) => {
        setContextMenu(null); // Close menu

        if (action === "DELETE_RESERVATION" && payload?.id) {
            if (confirm("Bu rezervasyonu silmek istediğinize emin misiniz?")) {
                setReservationsState(prev => prev.filter(r => r.id !== payload.id));
            }
        }

        if (action === "CHECK_IN" && payload?.id) {
            setReservationsState(prev => prev.map(r =>
                r.id === payload.id ? { ...r, status: "InHouse", color: "bg-blue-600" } : r
            ));
        }

        if (action === "BLOCK_ROOM" && payload?.roomId) {
            const newBlockId = `BLK-${Date.now()}`;
            const newBlock = {
                id: newBlockId,
                roomId: payload.roomId,
                guest: "ARIZA / TADİLAT",
                start: currentDate.toISOString().split("T")[0],
                end: new Date(currentDate.getTime() + 86400000 * 3).toISOString().split("T")[0], // 3 days block
                status: "Blocked",
                color: "bg-gray-600"
            };
            setReservationsState(prev => [...prev, newBlock]);
        }

        if (action === "CLEAN_ROOM" && payload?.roomId) {
            // Visual feedback for cleaning
            alert(`Oda ${payload.roomId} temizlik ekibine bildirildi.`);
        }
    };

    // Filtered Rooms
    const filteredRooms = roomsState.filter(room => {
        if (filterType && room.type !== filterType) return false;
        if (filterFloor && room.floor !== filterFloor) return false;
        return true;
    });

    // Generate 30 days window
    const days = Array.from({ length: 30 }, (_, i) => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() + i);
        return d;
    });

    const getReservationStyle = (start: string, end: string) => {
        const startDate = new Date(start);
        const endDate = new Date(end);

        // Normalize time
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        const viewStart = new Date(days[0]);
        viewStart.setHours(0, 0, 0, 0);

        // Calculate offset days
        const diffTime = startDate.getTime() - viewStart.getTime();
        const offsetDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        // Calculate duration
        const durationTime = endDate.getTime() - startDate.getTime();
        const durationDays = Math.ceil(durationTime / (1000 * 60 * 60 * 24));

        return {
            left: `${offsetDays * CELL_WIDTH}px`,
            width: `${durationDays * CELL_WIDTH}px`
        };
    };

    const handleReservationClick = (res: any) => {
        setSelectedRes(res);
        setIsModalOpen(true);
    };

    const handleContextMenu = (e: React.MouseEvent, resId?: string, roomId?: string) => {
        e.preventDefault();
        setContextMenu({ x: e.pageX, y: e.pageY, reservationId: resId, roomId: roomId });
    };

    const handleEmptyCellClick = (roomId: string, date: Date) => {
        setSelectedRes({
            guestName: "",
            checkIn: date.toISOString().split("T")[0],
            checkOut: new Date(date.getTime() + 86400000).toISOString().split("T")[0],
            roomNumber: roomId,
            roomType: roomsState.find(r => r.id === roomId)?.type || "STD"
        });
        setIsModalOpen(true);
    }

    return (
        <>
            {/* Context Menu */}
            {contextMenu && (
                <div
                    className="fixed z-50 bg-white dark:bg-zinc-800 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700 py-1 w-56 text-sm"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 font-bold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-zinc-900/50">
                        {contextMenu.reservationId ? `${contextMenu.reservationId} İşlemleri` : "Oda İşlemleri"}
                    </div>
                    {contextMenu.reservationId ? (
                        <>
                            <button
                                onClick={() => handleReservationClick(reservationsState.find(r => r.id === contextMenu.reservationId))}
                                className="w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-3 text-gray-700 dark:text-gray-200"
                            >
                                <FaConciergeBell className="text-blue-500" /> Rezervasyon Kartı
                            </button>
                            <button
                                onClick={() => handleAction("CHECK_IN", { id: contextMenu.reservationId })}
                                className="w-full text-left px-4 py-2 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-3 text-gray-700 dark:text-gray-200"
                            >
                                <FaCheck className="text-green-500" /> Hızlı Check-In
                            </button>
                            <button className="w-full text-left px-4 py-2 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 flex items-center gap-3 text-gray-700 dark:text-gray-200">
                                <FaMoneyBillWave className="text-yellow-500" /> Tahsilat Ekle
                            </button>
                            <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                            <button
                                onClick={() => handleAction("DELETE_RESERVATION", { id: contextMenu.reservationId })}
                                className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 text-red-600"
                            >
                                <FaTrash /> İptal Et
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => handleEmptyCellClick(contextMenu.roomId!, new Date())}
                                className="w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-3 text-gray-700 dark:text-gray-200"
                            >
                                <FaPlus className="text-blue-500" /> Yeni Rezervasyon
                            </button>
                            <button
                                onClick={() => handleAction("CLEAN_ROOM", { roomId: contextMenu.roomId })}
                                className="w-full text-left px-4 py-2 hover:bg-orange-50 dark:hover:bg-orange-900/20 flex items-center gap-3 text-gray-700 dark:text-gray-200"
                            >
                                <FaBroom className="text-orange-500" /> Kirli/Temizle
                            </button>
                            <button
                                onClick={() => handleAction("BLOCK_ROOM", { roomId: contextMenu.roomId })}
                                className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-500"
                            >
                                <FaBan /> Odayı Blokla (Arıza)
                            </button>
                        </>
                    )}
                </div>
            )}

            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm select-none flex flex-col h-full">
                {/* Controls */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-800/50">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)))}
                            className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg"
                        >
                            <FaChevronLeft />
                        </button>
                        <span className="font-bold text-gray-700 dark:text-gray-200 self-center">
                            {currentDate.toLocaleDateString("tr-TR", { month: "long", year: "numeric" })}
                        </span>
                        <button
                            onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)))}
                            className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg"
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                    {/* Filters */}
                    <div className="flex gap-2">
                        <select onChange={(e) => setFilterType(e.target.value || null)} className="text-xs p-1 rounded border border-gray-300">
                            <option value="">Tüm Tipler</option>
                            <option value="STD">Standart</option>
                            <option value="DLX">Deluxe</option>
                            <option value="STE">Suite</option>
                        </select>
                        <select onChange={(e) => setFilterFloor(e.target.value ? Number(e.target.value) : null)} className="text-xs p-1 rounded border border-gray-300">
                            <option value="">Tüm Katlar</option>
                            <option value="1">1. Kat</option>
                            <option value="2">2. Kat</option>
                        </select>
                    </div>
                    <div className="flex gap-4 text-xs font-medium">
                        <div className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded-sm"></span> Dolu</div>
                        <div className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded-sm"></span> Giriş</div>
                        <div className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-sm"></span> Rezerve</div>
                        <div className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-600 rounded-sm"></span> Kapalı/Arıza</div>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar (Room Numbers) */}
                    <div className="flex-shrink-0 w-24 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-zinc-900 z-10 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.1)] overflow-y-auto mt-12">
                        {/* Spacer for header */}
                        {filteredRooms.map(room => (
                            <div
                                key={room.id}
                                className="h-14 border-b border-gray-100 dark:border-zinc-800 flex flex-col justify-center items-center group hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                                onContextMenu={(e) => handleContextMenu(e, undefined, room.id)}
                            >
                                <span className="font-bold text-gray-800 dark:text-gray-200">{room.id}</span>
                                <span className="text-[10px] text-gray-400">{room.type}</span>
                            </div>
                        ))}
                    </div>

                    {/* Timeline Grid */}
                    <div className="flex-1 overflow-auto relative" ref={scrollRef}>
                        <div className="min-w-max relative">
                            {/* Header (Dates) */}
                            <div className="flex h-12 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-800 sticky top-0 z-20">
                                {days.map((day, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "flex-shrink-0 border-r border-gray-200 dark:border-zinc-700 flex flex-col items-center justify-center text-xs",
                                            day.getDay() === 0 || day.getDay() === 6 ? "bg-gray-100 dark:bg-zinc-700/50" : ""
                                        )}
                                        style={{ width: CELL_WIDTH }}
                                    >
                                        <span className="font-bold text-gray-700 dark:text-gray-300">{day.getDate()}</span>
                                        <span className="text-[10px] text-gray-400">{day.toLocaleDateString('tr-TR', { weekday: 'short' })}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Rows */}
                            {filteredRooms.map(room => (
                                <div key={room.id} className="h-14 border-b border-gray-100 dark:border-zinc-800 relative bg-[url('/grid-pattern.png')] group">
                                    {/* Grid Lines & Hover Interactions */}
                                    <div className="absolute inset-0 flex">
                                        {days.map((day, i) => (
                                            <div
                                                key={i}
                                                onClick={() => handleEmptyCellClick(room.id, day)}
                                                onContextMenu={(e) => handleContextMenu(e, undefined, room.id)}
                                                className="flex-shrink-0 h-full border-r border-gray-100 dark:border-zinc-800/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors"
                                                style={{ width: CELL_WIDTH }}
                                                title={`Boş: ${room.id} - ${day.toLocaleDateString('tr-TR')}`}
                                            />
                                        ))}
                                    </div>

                                    {/* Reservations */}
                                    {reservationsState.filter(r => r.roomId === room.id).map(res => (
                                        <div
                                            key={res.id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleReservationClick(res);
                                            }}
                                            onContextMenu={(e) => handleContextMenu(e, res.id, room.id)}
                                            className={cn(
                                                "absolute top-2 bottom-2 rounded-md shadow-sm border border-black/10 flex items-center px-2 z-10 cursor-pointer overflow-hidden whitespace-nowrap hover:shadow-md transition-all text-xs font-semibold text-white hover:brightness-110",
                                                res.color
                                            )}
                                            style={getReservationStyle(res.start, res.end)}
                                            title={`${res.guest} (${res.start} - ${res.end})`}
                                        >
                                            {res.guest}
                                        </div>
                                    ))}
                                </div>
                            ))}

                            {/* Today Indicator (Mock position) */}
                            <div className="absolute top-0 bottom-0 border-l-2 border-red-500 z-20 pointer-events-none" style={{ left: `${3 * CELL_WIDTH + CELL_WIDTH / 2}px` }}>
                                <div className="absolute -top-1 -left-[3px] w-2 h-2 rounded-full bg-red-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Unified Reservation Modal */}
            <ReservationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={selectedRes}
            />
        </>
    );
}
