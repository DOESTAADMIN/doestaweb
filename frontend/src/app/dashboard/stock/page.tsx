"use client";

import { FaBox, FaBoxes, FaClipboardList, FaTruckLoading, FaWarehouse, FaExclamationTriangle, FaChartPie, FaBarcode } from "react-icons/fa";
import Link from "next/link";

const subModules = [
    { title: "Stok Durumu", icon: FaBoxes, desc: "Tüm depolardaki anlık stok miktarları", link: "/dashboard/stock/status", color: "bg-blue-500" },
    { title: "Ürünler & Reçeteler", icon: FaBox, desc: "Ürün tanımları ve üretim reçeteleri", link: "/dashboard/stock/items", color: "bg-indigo-500" },
    { title: "Depolar Arası Transfer", icon: FaTruckLoading, desc: "Depolar arası malzeme transferi", link: "/dashboard/stock/transfer", color: "bg-orange-500" },
    { title: "Sayım & Düzenleme", icon: FaClipboardList, desc: "Periyodik stok sayımı ve fire girişi", link: "/dashboard/stock/count", color: "bg-purple-500" },
    { title: "Depo Tanımları", icon: FaWarehouse, desc: "Ana depo ve alt depo tanımlamaları", link: "/dashboard/stock/warehouses", color: "bg-gray-500" },
    { title: "Kritik Stok Uyarıları", icon: FaExclamationTriangle, desc: "Azalan ürünler ve sipariş listesi", link: "/dashboard/stock/alerts", color: "bg-red-500" },
    { title: "Maliyet Raporları", icon: FaChartPie, desc: "Ürün bazlı maliyet ve tüketim raporları", link: "/dashboard/reports", color: "bg-green-500" },
    { title: "Barkod İşlemleri", icon: FaBarcode, desc: "Barkod yazdırma ve hızlı giriş/çıkış", link: "/dashboard/stock/barcode", color: "bg-teal-500" },
];

export default function StockPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stok & Depo Yönetimi</h1>
                <p className="text-gray-500 dark:text-gray-400">Ürün, reçete ve envanter kontrolü</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {subModules.map((mod, idx) => (
                    <Link
                        key={idx}
                        href={mod.link}
                        className="group bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-200 flex flex-col"
                    >
                        <div className={`h-12 w-12 rounded-lg ${mod.color} bg-opacity-10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <mod.icon className={`text-2xl ${mod.color.replace('bg-', 'text-')}`} />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {mod.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                            {mod.desc}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
