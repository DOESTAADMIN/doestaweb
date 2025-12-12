"use client";

import { useState } from "react";
import {
    FaSave, FaPrint, FaLock, FaTimes, FaCheck, FaHistory, FaArrowLeft, FaArrowRight,
    FaPlus, FaEdit, FaTrash, FaSyncAlt, FaBolt, FaSearch, FaEllipsisH
} from "react-icons/fa";
import { cn } from "@/lib/utils";

export default function NewReservationPage() {
    const [activeTab, setActiveTab] = useState("Misafirler");

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-100 dark:bg-zinc-950 text-xs text-gray-800 dark:text-gray-200 overflow-hidden">
            {/* 1. Top Toolbar */}
            <div className="bg-white dark:bg-zinc-900 border-b border-gray-300 dark:border-gray-800 p-1 flex items-center justify-between shadow-sm z-20 h-10 shrink-0">
                <div className="flex items-center gap-2">
                    <h1 className="text-sm font-bold text-blue-900 dark:text-blue-400 px-2 flex items-center gap-2">
                        Rezervasyon Kartı <FaHistory className="text-gray-400" />
                    </h1>
                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 mx-1"></div>
                    <ToolbarButton icon={FaArrowLeft} />
                    <ToolbarButton icon={FaPlus} />
                    <ToolbarButton icon={FaPrint} />
                    <ToolbarButton icon={FaLock} />
                    <ToolbarButton icon={FaArrowRight} />
                    <ToolbarButton icon={FaBolt} />
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 text-blue-600 hover:bg-blue-50 px-3 py-1 rounded font-bold transition-all">
                        <FaCheck /> <span className="hidden sm:inline">Kaydet</span>
                    </button>
                    <button className="text-red-500 hover:bg-red-50 p-1.5 rounded transition-all">
                        <FaTimes size={16} />
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden p-1 gap-1">

                {/* 2. Left Sidebar (320px Fixed) */}
                <div className="w-[320px] bg-white dark:bg-zinc-900 border border-gray-300 dark:border-gray-800 shadow-sm flex flex-col shrink-0 overflow-y-auto">
                    <div className="p-3 space-y-3">
                        {/* Agency Section */}
                        <div className="relative border-b pb-2 mb-2">
                            <label className="text-[10px] text-gray-500 block mb-0.5">Acenta</label>
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-sm text-gray-900 dark:text-gray-100">ONLINE</span>
                                <div className="flex gap-1 text-gray-400">
                                    <FaEllipsisH className="cursor-pointer hover:text-blue-600" />
                                    <FaEdit className="cursor-pointer hover:text-blue-600" />
                                </div>
                            </div>
                        </div>

                        {/* Voucher */}
                        <div className="mb-2">
                            <label className="text-[10px] text-gray-500 block">Voucher No</label>
                            <input type="text" defaultValue="SE66335R" className="w-full border-b border-gray-300 dark:border-gray-700 bg-transparent py-0.5 outline-none font-medium focus:border-blue-500" />
                        </div>

                        {/* Dates Grid */}
                        <div className="grid grid-cols-12 gap-2 bg-gray-50 dark:bg-zinc-800/50 p-2 rounded border border-gray-100 dark:border-gray-800">
                            <div className="col-span-5">
                                <label className="text-[10px] text-gray-500 block">Check-In</label>
                                <div className="font-bold text-sm border-b border-gray-300 dark:border-gray-600 py-0.5">27.07.2019</div>
                            </div>
                            <div className="col-span-4">
                                <label className="text-[10px] text-gray-500 block opacity-0">Time</label>
                                <div className="text-xs border-b border-gray-300 dark:border-gray-600 py-1 flex items-center gap-1 text-gray-600">
                                    <FaHistory size={10} /> 14:00
                                </div>
                            </div>
                            <div className="col-span-3">
                                <label className="text-[10px] text-gray-500 block text-right">Gece</label>
                                <div className="font-bold text-center border-b border-gray-300 dark:border-gray-600 py-0.5">9</div>
                            </div>

                            <div className="col-span-5">
                                <label className="text-[10px] text-gray-500 block">Check-Out</label>
                                <div className="font-bold text-sm border-b border-gray-300 dark:border-gray-600 py-0.5">05.08.2019</div>
                            </div>
                            <div className="col-span-4">
                                <label className="text-[10px] text-gray-500 block opacity-0">Time</label>
                                <div className="text-xs border-b border-gray-300 dark:border-gray-600 py-1 flex items-center gap-1 text-gray-600">
                                    <FaHistory size={10} /> 11:00
                                </div>
                            </div>
                            <div className="col-span-3">
                                <label className="text-[10px] text-gray-500 block text-right">Geç Çıkış</label>
                                <div className="font-bold text-center border-b border-gray-300 dark:border-gray-600 py-0.5">18:48</div>
                            </div>
                        </div>

                        {/* Room Info */}
                        <div className="grid grid-cols-4 gap-2">
                            <div className="col-span-3 relative">
                                <label className="text-[10px] text-gray-500 block">Oda Tipi *</label>
                                <div className="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 py-0.5">
                                    <span className="font-bold text-sm">Dlx</span>
                                    <FaSearch size={10} className="text-gray-400" />
                                </div>
                            </div>
                            <div className="col-span-1">
                                <label className="text-[10px] text-gray-500 block">Oda Sayısı</label>
                                <div className="font-bold text-center border-b border-gray-300 dark:border-gray-600 py-0.5">1</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-[10px] text-gray-500 block">Pansiyon *</label>
                                <div className="font-bold text-sm border-b border-gray-300 dark:border-gray-600 py-0.5">BB</div>
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-500 block">Uyruk *</label>
                                <div className="font-bold text-sm border-b border-gray-300 dark:border-gray-600 py-0.5">Germany</div>
                            </div>
                        </div>

                        {/* Pax Grid */}
                        <div className="grid grid-cols-4 gap-2 bg-blue-50/50 dark:bg-blue-900/10 p-2 rounded boerder border-blue-100 dark:border-blue-900/20">
                            {[
                                { l: "Ytş", v: 2 }, { l: "Çck1", v: 1 }, { l: "Çck2", v: 1 }, { l: "Bbk", v: 0 }
                            ].map((p, i) => (
                                <div key={i}>
                                    <label className="text-[10px] text-gray-500 block">{p.l}</label>
                                    <input type="number" defaultValue={p.v} className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 font-bold text-center py-0.5" />
                                </div>
                            ))}
                        </div>

                        {/* Assignment */}
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div className="relative">
                                <label className="text-[10px] text-gray-500 block">Oda</label>
                                <div className="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 py-0.5">
                                    <span className="font-bold text-lg">212</span>
                                    <FaSearch size={12} className="text-gray-400" />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-500 block">VOda Tipi</label>
                                <div className="font-bold text-sm border-b border-gray-300 dark:border-gray-600 py-1">Dlx</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] text-gray-500 block">Yatak Tipi</label>
                                <div className="font-bold text-sm border-b border-gray-300 dark:border-gray-600 py-0.5">King</div>
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-500 block text-red-500 font-bold">VIP Türü</label>
                                <div className="font-bold text-sm border-b border-gray-300 dark:border-gray-600 py-0.5 text-red-600">VIP1</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-auto pt-4">
                            <div>
                                <label className="text-[10px] text-gray-500 block">Repeat Misafir</label>
                                <div className="font-bold text-sm border-b border-gray-300 dark:border-gray-600 py-0.5">2</div>
                            </div>
                            <div className="relative">
                                <label className="text-[10px] text-gray-500 block">Konaklama</label>
                                <div className="font-bold text-sm border-b border-gray-300 dark:border-gray-600 py-0.5">Sold</div>
                                <div className="absolute right-0 bottom-1 text-[8px]">▼</div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* 3. Right Panel (Flexible) */}
                <div className="flex-1 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-gray-800 shadow-sm flex flex-col min-w-0">
                    {/* Tabs */}
                    <div className="flex items-center bg-gray-100 dark:bg-zinc-800/50 border-b border-gray-300 dark:border-gray-700">
                        {['Misafirler', 'Fiyatlandırma', 'Folyo', 'Diğer Detaylar', 'Notlar', 'İstek / Şikayet'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-6 py-2.5 font-bold text-xs uppercase tracking-tight transition-all relative border-r border-gray-200 dark:border-gray-700",
                                    activeTab === tab
                                        ? "bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 border-t-2 border-t-blue-600"
                                        : "text-gray-500 hover:bg-gray-200 dark:hover:bg-zinc-800"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content Area */}
                    <div className="flex-1 p-2 overflow-auto flex flex-col">

                        {/* Guest Toolbar */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex gap-1">
                                <ToolIcon icon={FaPlus} className="text-blue-600" />
                                <ToolIcon icon={FaEdit} />
                                <ToolIcon icon={FaTrash} className="text-red-500" />
                                <div className="w-px h-4 bg-gray-300 mx-1"></div>
                                <ToolIcon icon={FaSyncAlt} />
                                <ToolIcon icon={FaBolt} />
                            </div>
                            <div className="text-xs font-bold text-gray-600">Toplam: 4</div>
                        </div>

                        {/* Guest Grid (Elektra High Density) */}
                        <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-zinc-900 flex-1 min-h-[150px] relative">
                            <table className="w-full text-left text-[11px] border-collapse">
                                <thead className="bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 font-bold">
                                    <tr>
                                        <Th>Misafir Kontrol</Th>
                                        <Th>Ad</Th>
                                        <Th>Soyad</Th>
                                        <Th>Kimlik No</Th>
                                        <Th>Passport No</Th>
                                        <Th>Doğum Yeri</Th>
                                        <Th>Doğum Tarihi</Th>
                                        <Th>Telefon</Th>
                                        <Th>Email</Th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { chk: "Moore Olen AS4626...", n: "Moore", s: "Olen", id: "", p: "AS462654", bp: "BERLIN", bd: "16.08.1974" },
                                        { chk: "Ellen Olen 10.05.1980", n: "Ellen", s: "Olen", id: "", p: "WE22984", bp: "BERLIN", bd: "10.05.1980" },
                                        { chk: "Alixe Olen AR30238...", n: "Alixe", s: "Olen", id: "", p: "AR30238", bp: "BERLIN", bd: "30.06.2009" },
                                        { chk: "Jon Olen 04.04.2015", n: "Jon", s: "Olen", id: "", p: "YU43578", bp: "BERLIN", bd: "04.04.2015" },
                                    ].map((row, i) => (
                                        <tr key={i} className="hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer">
                                            <Td className="bg-gray-50/50">{row.chk}</Td>
                                            <Td>{row.n}</Td>
                                            <Td>{row.s}</Td>
                                            <Td>{row.id}</Td>
                                            <Td>{row.p}</Td>
                                            <Td>{row.bp}</Td>
                                            <Td>{row.bd}</Td>
                                            <Td>{""}</Td>
                                            <Td>{""}</Td>
                                        </tr>
                                    ))}
                                    {/* Empty rows filler */}
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <tr key={`empty-${i}`}><Td>&nbsp;</Td><Td>&nbsp;</Td><Td>&nbsp;</Td><Td>&nbsp;</Td><Td>&nbsp;</Td><Td>&nbsp;</Td><Td>&nbsp;</Td><Td>&nbsp;</Td><Td>&nbsp;</Td></tr>
                                    ))}
                                </tbody>
                            </table>
                            {/* Scrollbar filler visual */}
                            <div className="absolute right-0 top-0 bottom-0 w-3 bg-gray-50 border-l border-gray-200"></div>
                        </div>

                        {/* Horizontal Divider */}
                        <div className="h-1 bg-gray-200 dark:bg-gray-800 my-2 rounded"></div>

                        {/* Footer Details Grid */}
                        <div className="grid grid-cols-2 gap-6 mt-1 overflow-y-auto min-h-0">
                            {/* Left Col */}
                            <div className="space-y-2">
                                <InputGroup label="Misafir Ek İstekler" value="Orthopedic Pillov" />
                                <InputGroup label="CheckIn Mesajı" value="Please save address information" />
                                <InputGroup label="CheckOut Mesajı" value="Late check out request" />
                                <div className="grid grid-cols-2 gap-4">
                                    <InputGroup label="Market" value="EUR" />
                                    <InputGroup label="Kaynak" value="MAIL" />
                                </div>
                            </div>

                            {/* Right Col */}
                            <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <InputGroup label="Kontak Email" value="moore@gmail.com" />
                                    <InputGroup label="Kontak Telefonu" value="004934568726243" />
                                </div>

                                <SelectGroup label="Ödeyen" value="Acenta" />
                                <SelectGroup label="Ödeme Tipi" value="Krediye Kaldır" />

                                <div className="grid grid-cols-2 gap-4">
                                    <SelectGroup label="Durumu" value="Rezervasyon" />
                                    <div className="grid grid-cols-3 gap-2">
                                        <InputGroup label="Res ID" value="1837664" />
                                        <InputGroup label="Takip" value="1" />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

// -- Styled Components --

function ToolbarButton({ icon: Icon }: { icon: React.ElementType }) {
    return (
        <button className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:hover:bg-zinc-700 p-1.5 rounded transition-all">
            <Icon size={14} />
        </button>
    );
}

function ToolIcon({ icon: Icon, className }: { icon: React.ElementType, className?: string }) {
    return (
        <button className={cn("text-gray-500 hover:text-gray-800 p-1.5 hover:bg-gray-100 rounded", className)}>
            <Icon size={14} />
        </button>
    )
}

function Th({ children }: { children: React.ReactNode }) {
    return <th className="px-2 py-1 border-r border-b border-gray-300 dark:border-gray-700 whitespace-nowrap font-bold text-[10px] bg-gray-100 dark:bg-zinc-800">{children}</th>
}

function Td({ children, className }: { children: React.ReactNode, className?: string }) {
    return <td className={cn("px-2 py-1 border-r border-b border-gray-200 dark:border-gray-800 text-[11px] whitespace-nowrap overflow-hidden text-ellipsis h-6", className)}>{children}</td>
}

function InputGroup({ label, value }: { label: string, value?: string }) {
    return (
        <div className="relative">
            <label className="text-[10px] text-gray-500 block">{label}</label>
            <input type="text" defaultValue={value} className="w-full border-b border-gray-300 dark:border-gray-700 bg-transparent py-0.5 outline-none font-bold text-gray-800 dark:text-gray-200 text-xs focus:border-blue-500" />
        </div>
    )
}

function SelectGroup({ label, value }: { label: string, value: string }) {
    return (
        <div className="relative">
            <label className="text-[10px] text-gray-500 block">{label}</label>
            <div className="w-full border-b border-gray-300 dark:border-gray-700 bg-transparent py-0.5 outline-none font-bold text-gray-800 dark:text-gray-200 text-xs flex justify-between items-center cursor-pointer">
                {value}
                <span className="text-[8px] text-gray-400">▼</span>
            </div>
        </div>
    )
}
