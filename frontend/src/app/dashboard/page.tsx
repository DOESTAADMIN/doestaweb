"use client";

import React, { useEffect, useState } from "react";
import StatusCards from "@/components/dashboard/StatusCards";
import DailyStatusTable from "@/components/dashboard/DailyStatusTable";
import RoomStatusCharts from "@/components/dashboard/RoomStatusCharts";
import RightSidebarWidgets from "@/components/dashboard/RightSidebarWidgets";
import RightSidebarExtended from "@/components/dashboard/RightSidebarExtended";
import ForecastChart from "@/components/dashboard/ForecastChart";
import OccupancyCharts from "@/components/dashboard/OccupancyCharts";
import DashboardBottomTables from "@/components/dashboard/DashboardBottomTables";
import { FaSync } from "react-icons/fa";
import { dashboardService } from "@/lib/api";

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<string>("");
    const [forecastDate, setForecastDate] = useState<Date>(new Date());

    const fetchStats = async (dateOverride?: Date) => {
        setLoading(true);
        try {
            // Format date as YYYY-MM-DD for API
            const dateToSend = dateOverride || forecastDate;
            // Adjust for timezone offset to ensure correct day is sent
            const offsetDate = new Date(dateToSend.getTime() - (dateToSend.getTimezoneOffset() * 60000));
            const dateStr = offsetDate.toISOString().split('T')[0];

            const res = await dashboardService.getStats(dateStr);
            if (res.data) {
                setStats(res.data);
                setLastUpdated(new Date().toLocaleString('tr-TR'));
            }
        } catch (error) {
            console.error("Dashboard stats fetch error", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (newDate: Date) => {
        setForecastDate(newDate);
        fetchStats(newDate);
    }

    useEffect(() => {
        fetchStats();
        // const interval = setInterval(() => fetchStats(), 30000); // disable poll while debugging date nav
        // return () => clearInterval(interval);
    }, []);

    // Helper to protect against null stats during initial load
    const safeStats = stats || {};

    return (
        <div className="min-h-full flex flex-col pt-4 pb-12">

            {/* Dashboard Controls / Header */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-2 mb-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                    <button onClick={() => fetchStats()} className="hover:text-blue-600 transition-colors" disabled={loading}>
                        <FaSync className={loading ? "animate-spin" : ""} />
                    </button>
                    <span>Rapor Hazırlanma Zamanı : {lastUpdated || "Yükleniyor..."}</span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        className="px-4 py-1.5 bg-white dark:bg-zinc-800 border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 font-semibold text-xs rounded-t hover:bg-gray-50"
                        onClick={() => { }} // Already on Dashboard
                    >
                        Ana Ekran
                    </button>
                    <button
                        className="px-4 py-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium text-xs hover:bg-gray-50 rounded-t transition-colors"
                        onClick={() => window.location.href = '/dashboard/front-office/reservations?filter=today'}
                    >
                        Bekleyen Gelişler
                    </button>
                    <button
                        className="px-4 py-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium text-xs hover:bg-gray-50 rounded-t transition-colors"
                        onClick={() => window.location.href = '/dashboard/front-office/reservations?filter=checkout'}
                    >
                        Bekleyen Çıkışlar
                    </button>
                </div>

                <button
                    className="bg-red-700 hover:bg-red-800 text-white px-3 py-1.5 rounded text-xs font-semibold"
                    onClick={() => window.location.href = '/dashboard/reports'}
                >
                    Yönetim Raporları
                </button>
            </div>

            {/* Main Content Layout */}
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Left Column (Main Stats & Charts) */}
                <div className="flex-1 min-w-0 space-y-4">
                    {/* Status Cards Row */}
                    <StatusCards stats={safeStats} loading={loading} />

                    {/* Lower Section: Table & Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="min-h-[400px]">
                            <DailyStatusTable stats={safeStats} loading={loading} />
                        </div>
                        <div className="min-h-[400px]">
                            <RoomStatusCharts stats={safeStats} loading={loading} />
                        </div>
                    </div>

                    {/* Scroll: Forecast Chart */}
                    <ForecastChart
                        forecast={safeStats.forecast}
                        loading={loading}
                        currentDate={forecastDate}
                        onDateChange={handleDateChange}
                    />

                    {/* Scroll: Occupancy Charts */}
                    <OccupancyCharts
                        forecast={safeStats.forecast}
                        accommodationStats={safeStats.accommodationStats}
                        boardStats={safeStats.boardStats}
                        loading={loading}
                    />

                    {/* Scroll: Bottom Tables */}
                    <DashboardBottomTables data={safeStats.availabilityTable} loading={loading} onRefresh={fetchStats} />
                </div>

                {/* Right Column (Widgets) - Fixed Width on Large Screens */}
                <div className="w-full lg:w-72 flex-shrink-0">
                    <RightSidebarWidgets />
                    <RightSidebarExtended
                        ageStats={safeStats.ageStats}
                        bookingsMadeToday={safeStats.bookingsMadeToday}
                        folioTypes={safeStats.folioTypes}
                        repeaterCount={safeStats.repeaterCount}
                        boardStats={safeStats.boardStats}
                    />
                </div>
            </div>
        </div>
    );
}
