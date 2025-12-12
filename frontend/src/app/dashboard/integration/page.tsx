"use client";

import { FaCode, FaKey, FaServer, FaExchangeAlt, FaShieldAlt, FaTerminal, FaDatabase, FaPlug } from "react-icons/fa";
import Link from "next/link";

const subModules = [
    { title: "API Anahtarları", icon: FaKey, desc: "REST API erişim token ve anahtarları", link: "/dashboard/integration/api-keys", color: "bg-yellow-500" },
    { title: "Entegrasyonlar", icon: FaPlug, desc: "KBS, e-Fatura, Kapı Kilidi vb. bağlantılar", link: "/dashboard/integration/connections", color: "bg-blue-500" },
    { title: "Webhook Ayarları", icon: FaExchangeAlt, desc: "Gerçek zamanlı veri bildirim ayarları", link: "/dashboard/integration/webhooks", color: "bg-purple-500" },
    { title: "Sistem Logları", icon: FaTerminal, desc: "API istek ve hata kayıtları", link: "/dashboard/integration/logs", color: "bg-gray-500" },
    { title: "Veritabanı Durumu", icon: FaDatabase, desc: "DB bağlantı ve performans metrikleri", link: "/dashboard/integration/database", color: "bg-green-500" },
    { title: "Güvenlik Duvarı", icon: FaShieldAlt, desc: "IP kısıtlamaları ve erişim kuralları", link: "/dashboard/integration/security", color: "bg-red-500" },
    { title: "Backend Sunucu", icon: FaServer, desc: "Sunucu durumu ve restart işlemleri", link: "/dashboard/integration/server", color: "bg-indigo-500" },
    { title: "API Dokümantasyon", icon: FaCode, desc: "Geliştirici dokümanları (Swagger)", link: "/api/docs", color: "bg-teal-500" },
];

export default function IntegrationPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Entegrasyon & API</h1>
                <p className="text-gray-500 dark:text-gray-400">Sistem bağlantıları ve geliştirici araçları</p>
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
