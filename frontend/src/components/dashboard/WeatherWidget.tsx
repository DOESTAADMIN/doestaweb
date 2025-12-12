"use client";

import { FaSun, FaCloudSun, FaCloud, FaUmbrella } from "react-icons/fa";

export default function WeatherWidget() {
    return (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg shadow-blue-500/30 h-full flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <FaSun size={80} />
            </div>

            <div className="flex justify-between items-start z-10">
                <div>
                    <h3 className="text-xs font-bold text-blue-100 uppercase mb-1">Antalya</h3>
                    <p className="text-3xl font-bold">28°C</p>
                    <p className="text-xs text-blue-100 mt-1">Güneşli & Açık</p>
                </div>
                <FaSun className="text-yellow-300 text-3xl animate-pulse" />
            </div>

            <div className="flex gap-2 mt-4 z-10 overflow-x-auto">
                <div className="flex flex-col items-center bg-white/20 rounded p-1.5 min-w-[50px]">
                    <span className="text-[10px] font-bold">Bugün</span>
                    <FaCloudSun className="my-1 text-yellow-200" />
                    <span className="text-xs font-bold">29°</span>
                </div>
                <div className="flex flex-col items-center bg-white/10 rounded p-1.5 min-w-[50px]">
                    <span className="text-[10px] font-bold text-blue-100">Yarın</span>
                    <FaCloud className="my-1 text-white" />
                    <span className="text-xs font-bold text-blue-100">26°</span>
                </div>
                <div className="flex flex-col items-center bg-white/10 rounded p-1.5 min-w-[50px]">
                    <span className="text-[10px] font-bold text-blue-100">Cmt</span>
                    <FaUmbrella className="my-1 text-white" />
                    <span className="text-xs font-bold text-blue-100">24°</span>
                </div>
            </div>
        </div>
    );
}
