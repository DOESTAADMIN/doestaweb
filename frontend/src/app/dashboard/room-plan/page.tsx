"use client";

import { useState, useEffect, useMemo } from "react";
import RoomCard, { RoomStatus } from "@/components/rooms/RoomCard";
import RoomRackSidebar, { FilterCounts } from "@/components/dashboard/room-plan/RoomRackSidebar";
import NewReservationModal from "@/components/reservations/NewReservationModal";
import ReservationModal from "@/components/reservations/ReservationModal";
import { FaSyncAlt, FaTh, FaList, FaQuestionCircle, FaCheck, FaCheckDouble } from "react-icons/fa";
import { roomService, reservationService } from "@/lib/api";

interface RoomPlanItem {
    id: number;
    number: string;
    type: string;
    bedType: string;
    status: string;
    floor: string;
    view: string;
    isOccupied: boolean;
    guestName?: string;
    pax?: number;
    isDirty: boolean;
    reservationId?: number;
}

export default function RoomPlanPage() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [loading, setLoading] = useState(true);
    const [allRooms, setAllRooms] = useState<RoomPlanItem[]>([]);

    // Modal States
    const [newResModalOpen, setNewResModalOpen] = useState(false);
    const [selectedRoomNumber, setSelectedRoomNumber] = useState<string>("");

    const [resDetailModalOpen, setResDetailModalOpen] = useState(false);
    const [selectedReservationId, setSelectedReservationId] = useState<number | null>(null);
    const [selectedReservationData, setSelectedReservationData] = useState<any>(null);

    // Selection & Context Menu
    const [selectedRoomIds, setSelectedRoomIds] = useState<number[]>([]);
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, roomId: number } | null>(null);

    // Bulk Actions & View Mode State
    const [bulkMenuOpen, setBulkMenuOpen] = useState(false);

    const [filters, setFilters] = useState({
        status: [] as string[],
        type: [] as string[],
        bedType: [] as string[],
        floor: [] as string[],
        view: [] as string[],
        search: ""
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await roomService.getRoomPlan({
                floor: filters.floor.length === 0 ? undefined : filters.floor.join(','), // Assuming API expects comma-separated string for multiple filters
                type: filters.type.length === 0 ? undefined : filters.type.join(','),
                status: filters.status.length === 0 ? undefined : filters.status.join(',')
            });
            setAllRooms(data);
        } catch (error) {
            console.error("Failed to fetch room plan", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Close context menu on click outside
        const handleClickOutside = () => setContextMenu(null);
        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, [filters]); // Added filters to dependency array

    const handleFilterChange = (category: string, value: string, checked: boolean) => {
        setFilters(prev => {
            const current = (prev as any)[category] as string[];
            const updated = checked
                ? [...current, value]
                : current.filter(item => item !== value);
            return { ...prev, [category]: updated };
        });
    };

    const handleSearchChange = (value: string) => {
        setFilters(prev => ({ ...prev, search: value }));
    };

    // Calculate Derived State (Filtered Rooms & Counts)
    const { filteredRooms, counts } = useMemo(() => {
        let result = allRooms;

        // Apply Search
        if (filters.search) {
            const term = filters.search.toLowerCase();
            result = result.filter(r => r.number.toLowerCase().includes(term) || r.guestName?.toLowerCase().includes(term));
        }

        // Apply Category Filters
        if (filters.type.length > 0) result = result.filter(r => filters.type.includes(r.type));
        if (filters.bedType.length > 0) result = result.filter(r => filters.bedType.includes(r.bedType || "Other"));
        if (filters.floor.length > 0) result = result.filter(r => filters.floor.includes(r.floor));
        if (filters.view.length > 0) result = result.filter(r => filters.view.includes(r.view || "Standart"));

        // Apply Status Filter (Complex)
        if (filters.status.length > 0) {
            result = result.filter(r => {
                // If any of the checked statuses match the room condition, keep it.
                // Status mapping:
                // "Occupied" -> r.isOccupied
                // "Vacant" -> !r.isOccupied
                // "Clean" -> r.status == 'Clean' && !r.isOccupied (typically) or just !r.isDirty
                // "Dirty" -> r.isDirty || r.status == 'Dirty'

                let match = false;
                if (filters.status.includes('Occupied') && r.isOccupied) match = true;
                if (filters.status.includes('Vacant') && !r.isOccupied) match = true;
                if (filters.status.includes('Clean') && !r.isDirty) match = true; // Simplified
                if (filters.status.includes('Dirty') && r.isDirty) match = true;
                return match;
            });
        }

        // Calculate Counts from ALL Rooms (for Sidebar)
        const newCounts: FilterCounts = {
            occupied: allRooms.filter(r => r.isOccupied).length,
            vacant: allRooms.filter(r => !r.isOccupied).length,
            clean: allRooms.filter(r => !r.isDirty).length,
            dirty: allRooms.filter(r => r.isDirty).length,
            types: {},
            bedTypes: {},
            floors: {},
            views: {}
        };

        allRooms.forEach(r => {
            // Type
            newCounts.types[r.type] = (newCounts.types[r.type] || 0) + 1;
            // BedType
            const bType = r.bedType || "Other";
            newCounts.bedTypes[bType] = (newCounts.bedTypes[bType] || 0) + 1;
            // Floor
            if (r.floor) newCounts.floors[r.floor] = (newCounts.floors[r.floor] || 0) + 1;
            // View
            const vType = r.view || "Standart";
            newCounts.views[vType] = (newCounts.views[vType] || 0) + 1;
        });

        return { filteredRooms: result, counts: newCounts };
    }, [allRooms, filters]);

    const handleCreateReservation = async (data: any) => {
        try {
            // Find room ID based on number
            const room = allRooms.find(r => r.number === data.room);
            const roomId = room?.id || 0; // Fallback? Backend expects roomId usually

            const formattedData = {
                roomId: roomId,
                checkInDate: data.checkIn,
                checkOutDate: data.checkOut,
                adultCount: parseInt(data.adults),
                childCount: parseInt(data.children),
                guestName: data.guestName,
                agency: data.agency,
                boardType: data.board,
                totalPrice: parseFloat(data.balance),
                status: "Confirmed",
                isPaid: false,
                paidAmount: 0,
                // Additional defaults
                currency: "EUR",
                roomType: room?.type || "STD"
            };

            await reservationService.create(formattedData);
            fetchData();
        } catch (error) {
            console.error("Failed to create reservation", error);
        }
    };

    const handleRoomSelect = (roomId: number, multiSelect: boolean) => {
        if (multiSelect) {
            setSelectedRoomIds(prev =>
                prev.includes(roomId) ? prev.filter(id => id !== roomId) : [...prev, roomId]
            );
        } else {
            setSelectedRoomIds(prev => prev.includes(roomId) ? [] : [roomId]);
        }
    };

    const handleContextMenuAction = async (action: string) => {
        if (!contextMenu) return;
        const roomId = contextMenu.roomId;

        try {
            if (action === "Clean") await roomService.updateStatus(roomId, "Clean");
            if (action === "Dirty") await roomService.updateStatus(roomId, "Dirty");
            // Add more actions like "Maintenance", "Block", etc.

            // Optimistic update
            setAllRooms(prev => prev.map(r => r.id === roomId ? { ...r, isDirty: action === "Dirty", status: (action === "Clean" && !r.isOccupied) ? "Clean" : r.status } : r));

        } catch (error) {
            console.error("Action failed", error);
            fetchData();
        }
    };

    // Handle Bulk Actions
    const handleBulkAction = async (action: string) => {
        setBulkMenuOpen(false);
        if (selectedRoomIds.length === 0) return;

        // Optimistic Update for ALL selected rooms
        const isDirty = action === 'Dirty';
        const newStatus = action === 'Clean' ? 'Clean' : 'Dirty';

        setAllRooms(prev => prev.map(r => selectedRoomIds.includes(r.id) ? { ...r, status: r.isOccupied ? "Occupied" : newStatus, isDirty: r.isOccupied ? r.isDirty : isDirty } : r));

        // Processing in background (ideally utilize a bulk endpoint)
        try {
            // Sequential for now to avoid hammering simple backend, or Promise.all
            await Promise.all(selectedRoomIds.map(id => roomService.updateStatus(id, action)));
        } catch (error) {
            console.error("Bulk action failed", error);
            fetchData();
        }
        setSelectedRoomIds([]); // clear selection after action
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-black/20" onContextMenu={(e) => e.preventDefault()}>
            {/* Sidebar */}
            <RoomRackSidebar
                counts={counts}
                filters={filters}
                onFilterChange={handleFilterChange}
                onSearchChange={handleSearchChange}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Top Bar matching screenshot */}
                <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 p-2 flex items-center justify-between shadow-sm z-10">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={fetchData}
                            disabled={loading}
                            className={`p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-transform ${loading ? 'animate-spin' : ''}`}
                        >
                            <FaSyncAlt />
                        </button>
                        <h1 className="text-xl font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                            <FaQuestionCircle className="text-gray-400 text-sm" /> Room Rack
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="text-xs text-gray-500 mr-2 font-medium">
                            {selectedRoomIds.length > 0 && <span>{selectedRoomIds.length} oda seçili</span>}
                        </div>

                        {/* View Toggles */}
                        <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-1.5 rounded shadow-sm transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-zinc-700 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <FaTh />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-1.5 rounded shadow-sm transition-all ${viewMode === 'list' ? 'bg-white dark:bg-zinc-700 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <FaList />
                            </button>
                        </div>

                        {/* Bulk Action Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setBulkMenuOpen(!bulkMenuOpen)}
                                disabled={selectedRoomIds.length === 0}
                                className={`flex items-center px-3 py-1.5 rounded text-xs gap-2 font-medium transition-colors ${selectedRoomIds.length > 0
                                    ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                <span>Durum</span>
                                <FaCheck />
                            </button>

                            {bulkMenuOpen && selectedRoomIds.length > 0 && (
                                <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-xl rounded-lg z-50 py-1 overflow-hidden">
                                    <div className="px-3 py-2 border-b border-gray-100 dark:border-zinc-700 text-xs font-bold text-gray-500 uppercase">
                                        Toplu İşlem
                                    </div>
                                    <button
                                        onClick={() => handleBulkAction("Clean")}
                                        className="w-full text-left px-3 py-2.5 text-sm hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 flex items-center gap-2"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div> Temize Al
                                    </button>
                                    <button
                                        onClick={() => handleBulkAction("Dirty")}
                                        className="w-full text-left px-3 py-2.5 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 flex items-center gap-2"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-red-500"></div> Kirlet
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Select All / Deselect All */}
                        <button
                            className={`p-1.5 border rounded transition-colors ${selectedRoomIds.length === allRooms.length && allRooms.length > 0
                                ? 'bg-blue-50 border-blue-300 text-blue-600'
                                : 'border-gray-300 text-gray-500 hover:bg-gray-100'
                                }`}
                            onClick={() => {
                                if (selectedRoomIds.length === allRooms.length) {
                                    setSelectedRoomIds([]); // Deselect All
                                } else {
                                    setSelectedRoomIds(allRooms.map(r => r.id)); // Select All
                                }
                            }}
                            title={selectedRoomIds.length === allRooms.length ? "Seçimi Kaldır" : "Tümünü Seç"}
                        >
                            <FaCheckDouble />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 content-start relative" onClick={() => { setContextMenu(null); setBulkMenuOpen(false); }}>
                    {loading && allRooms.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-400">Yükleniyor...</div>
                    ) : (
                        <>
                            {viewMode === 'grid' ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 pb-20">
                                    {filteredRooms.map((room) => (
                                        <RoomCard
                                            key={room.id}
                                            roomNumber={room.number}
                                            type={room.type}
                                            bedType={room.bedType}
                                            status={room.status as RoomStatus}
                                            guestName={room.guestName}
                                            pax={room.pax}
                                            isDirty={room.isDirty}
                                            isSelected={selectedRoomIds.includes(room.id)}

                                            onSelect={(e) => handleRoomSelect(room.id, true)}

                                            onMenuClick={(e) => {
                                                const x = Math.min(e.clientX, window.innerWidth - 150);
                                                const y = Math.min(e.clientY, window.innerHeight - 200);
                                                setContextMenu({ x, y, roomId: room.id });
                                            }}

                                            onStatusToggle={async (e) => {
                                                const newStatus = room.isDirty ? "Clean" : "Dirty";
                                                setAllRooms(prev => prev.map(r => r.id === room.id ? { ...r, isDirty: !room.isDirty, status: r.isOccupied ? "Occupied" : newStatus } : r));
                                                try { await roomService.updateStatus(room.id, newStatus); } catch (e) { fetchData(); }
                                            }}

                                            onQuickReserve={(e) => {
                                                setSelectedRoomNumber(room.number);
                                                setNewResModalOpen(true);
                                            }}

                                            onClick={() => {
                                                if (room.isOccupied && room.reservationId) {
                                                    setSelectedReservationId(room.reservationId);
                                                    setResDetailModalOpen(true);
                                                } else {
                                                    setSelectedRoomNumber(room.number);
                                                    setNewResModalOpen(true);
                                                }
                                            }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                // List View Implementation
                                <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden pb-20">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 dark:bg-zinc-800 text-gray-500 border-b border-gray-200 dark:border-zinc-700">
                                            <tr>
                                                <th className="px-4 py-3 w-10">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedRoomIds.length > 0 && selectedRoomIds.length === filteredRooms.length}
                                                        onChange={() => {
                                                            if (selectedRoomIds.length === filteredRooms.length) setSelectedRoomIds([]);
                                                            else setSelectedRoomIds(filteredRooms.map(r => r.id));
                                                        }}
                                                        className="rounded border-gray-300"
                                                    />
                                                </th>
                                                <th className="px-4 py-3">Oda No</th>
                                                <th className="px-4 py-3">Tip</th>
                                                <th className="px-4 py-3">Durum</th>
                                                <th className="px-4 py-3">Misafir</th>
                                                <th className="px-4 py-3">Giriş/Çıkış</th>
                                                <th className="px-4 py-3 text-right">İşlemler</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                                            {filteredRooms.map(room => (
                                                <tr key={room.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer" onClick={() => {
                                                    if (room.isOccupied && room.reservationId) {
                                                        setSelectedReservationId(room.reservationId);
                                                        setResDetailModalOpen(true);
                                                    } else {
                                                        setSelectedRoomNumber(room.number);
                                                        setNewResModalOpen(true);
                                                    }
                                                }}>
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedRoomIds.includes(room.id)}
                                                            onClick={(e) => e.stopPropagation()}
                                                            onChange={() => handleRoomSelect(room.id, true)}
                                                            className="rounded border-gray-300"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 font-bold text-gray-700 dark:text-gray-200">{room.number}</td>
                                                    <td className="px-4 py-3 text-gray-500">{room.type}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${room.isDirty ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                            {room.isOccupied ? 'DOLU' : 'BOŞ'} - {room.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                                                        {room.guestName || "-"}
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-500 text-xs">
                                                        {room.reservationId ? "..." : "-"}
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <button
                                                            className="p-1 text-gray-400 hover:text-blue-600"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const x = e.clientX;
                                                                const y = e.clientY;
                                                                setContextMenu({ x, y, roomId: room.id });
                                                            }}
                                                        >
                                                            <FaList />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Context Menu Overlay */}
                {contextMenu && (
                    <div
                        className="fixed z-50 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-lg rounded-lg py-1 w-40 text-sm"
                        style={{ top: contextMenu.y, left: contextMenu.x }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="px-3 py-2 border-b border-gray-100 dark:border-zinc-700 font-bold text-gray-700 dark:text-gray-300">
                            Oda İşlemleri
                        </div>
                        <button onClick={() => handleContextMenuAction("Clean")} className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 text-green-600">
                            Temize Al
                        </button>
                        <button onClick={() => handleContextMenuAction("Dirty")} className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 text-red-600">
                            Kirlet
                        </button>
                        <button className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-600">
                            Blokaj Koy
                        </button>
                        <button className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-600">
                            Arızaya Al
                        </button>
                    </div>
                )}
            </div>

            {/* Modals */}
            <NewReservationModal
                isOpen={newResModalOpen}
                onClose={() => setNewResModalOpen(false)}
                onSubmit={handleCreateReservation}
                initialRoom={selectedRoomNumber}
            />

            {selectedReservationId && (
                <ReservationModal
                    isOpen={resDetailModalOpen}
                    onClose={() => setResDetailModalOpen(false)}
                    initialData={{ id: selectedReservationId }}
                    onSave={() => {
                        setResDetailModalOpen(false);
                        fetchData();
                    }}
                />
            )}
        </div>
    );
}
