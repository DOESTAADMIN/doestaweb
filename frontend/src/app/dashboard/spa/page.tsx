"use client";

import { FaSpa, FaCalendarAlt, FaUserEdit, FaNotesMedical, FaListUl, FaUserCheck, FaHotTub, FaRunning } from "react-icons/fa";
import Link from "next/link";

const subModules = [
    { title: "Randevu Takvimi", icon: FaCalendarAlt, desc: "Masaj ve bakım randevularını yönetin", link: "/dashboard/spa/scheduler", color: "bg-pink-500" },
    { title: "Hizmetler & Bakımlar", icon: FaSpa, desc: "Masaj, cilt bakımı ve paket tanımları", link: "/dashboard/spa/services", color: "bg-purple-500" },
    { title: "Terapist Yönetimi", icon: FaUserEdit, desc: "Terapist çalışma saatleri ve komisyon", link: "/dashboard/spa/therapists", color: "bg-blue-500" },
    { title: "Sağlık Formları", icon: FaNotesMedical, desc: "Misafir sağlık geçmişi ve onam formları", link: "/dashboard/spa/forms", color: "bg-red-500" },
    { title: "Üyelik & Paketler", icon: FaListUl, desc: "Fitness ve SPA üyelik paketleri", link: "/dashboard/spa/memberships", color: "bg-green-500" },
    { title: "Salon Doluluk", icon: FaHotTub, desc: "Oda ve ekipman doluluk durumu", link: "/dashboard/spa/rooms", color: "bg-orange-500" },
    { title: "Eğitmenler", icon: FaRunning, desc: "Fitness ve spor eğitmenleri", link: "/dashboard/spa/trainers", color: "bg-teal-500" },
    { title: "Misafir Kabul", icon: FaUserCheck, desc: "SPA resepsiyon karşılama ekranı", link: "/dashboard/spa/reception", color: "bg-indigo-500" },
];

export default function SpaPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SPA & Wellness</h1>
                <p className="text-gray-500 dark:text-gray-400">Sağlık kulübü ve aktivite yönetimi</p>
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
