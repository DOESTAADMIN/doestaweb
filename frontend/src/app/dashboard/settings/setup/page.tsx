"use client";

import React, { useState } from 'react';
import {
    FaUniversity, FaCogs, FaTools, FaCamera, FaEnvelope, FaMobileAlt,
    FaKey, FaServer, FaBed, FaLayerGroup, FaMapMarkerAlt, FaMountain,
    FaBuilding, FaCalculator, FaSitemap, FaMoneyBillWave, FaExchangeAlt,
    FaFileInvoice, FaTimesCircle, FaUtensils, FaTags, FaQuestionCircle,
    FaChevronUp, FaChevronDown
} from 'react-icons/fa';
import Link from 'next/link';
import { cn } from "@/lib/utils";

export default function SetupPage() {
    return (
        <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-50 dark:bg-black/20 p-4 overflow-y-auto">
            <h1 className="text-xl font-bold text-blue-900 dark:text-blue-400 mb-6 flex items-center gap-2">
                Kuruluş Menüsü
            </h1>

            <div className="space-y-6">

                {/* 1. Temel Otel ve Kullanıcı Tanımları (Blue) */}
                <Section title="Temel Otel ve Kullanıcı Tanımları">
                    <SetupButton icon={FaUniversity} label="Otel Tanımları" color="blue" href="/dashboard/settings/hotel-info" />
                    <SetupButton icon={FaCogs} label="Varsayılan Otel Ayarları" color="blue" />
                    <SetupButton icon={FaCogs} label="Varsayılan Otel Ayarları 2" color="blue" />
                    <SetupButton icon={FaCogs} label="Varsayılan Pos Ayarları" color="blue" />

                    <SetupButton icon={FaTools} label="Konfigürasyon Parametreleri" color="blue" />
                    <SetupButton icon={FaCamera} label="Fotoğraf Ekle" color="blue" />
                    <SetupButton icon={FaCamera} label="Otel Fotoğraflarını Ekle" color="blue" />
                    <SetupButton icon={FaTools} label="Kullanıcı Tanımları" color="blue" />

                    <SetupButton icon={FaEnvelope} label="E Mail Taslağı" color="blue" />
                    <SetupButton icon={FaMobileAlt} label="SMS Şablonu" color="blue" />
                    <SetupButton icon={FaKey} label="Kart Görüntüleme Şifresi Ayarla" color="blue" />
                    <SetupButton icon={FaServer} label="SMTP Ayarları" color="blue" />

                    <SetupButton icon={FaTools} label="Room Rack Renk Ayarları" color="blue" />
                </Section>

                {/* 2. Oda Tanımları (Red) */}
                <Section title="Oda Tanımları">
                    <SetupButton icon={FaBed} label="Yatak Tipi Tanımları" color="red" href="/dashboard/settings/bed-types" />
                    <SetupButton icon={FaLayerGroup} label="Oda Tipi Tanımları" color="red" href="/dashboard/settings/room-types" />
                    <SetupButton icon={FaMapMarkerAlt} label="Konum Tanımları" color="red" />
                    <SetupButton icon={FaMountain} label="Manzara Tanımları" color="red" />

                    <SetupButton icon={FaBuilding} label="Oda Tanımları" color="red" href="/dashboard/settings/rooms" />
                    <SetupButton icon={FaBuilding} label="Oda Tipi Grupları" color="red" />
                </Section>

                {/* 3. Muhasebe Tanımları (Blue) */}
                <Section title="Muhasebe Tanımları">
                    <SetupButton icon={FaSitemap} label="Departman Tanımları" color="blue" />
                    <SetupButton icon={FaSitemap} label="Departman Grup Tanımları" color="blue" />
                    <SetupButton icon={FaSitemap} label="Departman Grup Tanımları" color="blue" />
                    <SetupButton icon={FaCalculator} label="Gelir Kodu Tanımları" color="blue" href="/dashboard/settings/revenue" />
                    <SetupButton icon={FaMoneyBillWave} label="Döviz Tanımları" color="blue" href="/dashboard/settings/currency" />

                    <SetupButton icon={FaExchangeAlt} label="Kur Markup Tanımları" color="blue" />
                    <SetupButton icon={FaCalculator} label="Kiralanan Tanımları" color="blue" />
                    <SetupButton icon={FaCalculator} label="Fix Fiyat Tanımları" color="blue" />
                    <SetupButton icon={FaFileInvoice} label="Fatura Dizayn" color="blue" />

                    <SetupButton icon={FaTimesCircle} label="Kasa Kapatma Listesi" color="blue" />
                </Section>

                {/* 4. Rezervasyon ve Fiyat Detay Tanımları (Red) */}
                <Section title="Rezervasyon ve Fiyat Detay Tanımları">
                    <SetupButton icon={FaUtensils} label="Pansiyon Tipi Tanımları" color="red" href="/dashboard/settings/board-types" />
                    <SetupButton icon={FaTags} label="Fiyat Tipi Tanımları" color="red" href="/dashboard/settings/price-types" />
                    <SetupButton icon={FaTools} label="Vergi Tanımları" color="gray" opacity={true} />
                    <SetupButton icon={FaQuestionCircle} label="Online Bilgi" color="red" />
                </Section>

            </div>
        </div>
    );
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700">
            <div
                className="px-4 py-2 flex justify-between items-center cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className="font-bold text-gray-700 dark:text-gray-300 text-sm">{title}</h3>
                {isOpen ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
            </div>
            {isOpen && (
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700">
                    {children}
                </div>
            )}
        </div>
    )
}

function SetupButton({ icon: Icon, label, color, opacity = false, href }: { icon: any, label: string, color: "blue" | "red" | "gray", opacity?: boolean, href?: string }) {
    const colorClass = {
        blue: "bg-blue-800 hover:bg-blue-900",
        red: "bg-red-500 hover:bg-red-600",
        gray: "bg-gray-200 text-gray-400"
    }[color];

    const content = (
        <div className={cn(
            "flex items-center gap-3 px-4 py-3 rounded text-white font-semibold text-sm transition-all shadow-sm w-full text-left",
            colorClass,
            opacity && "opacity-50 cursor-not-allowed hover:bg-gray-200"
        )}>
            <Icon size={16} className="opacity-80" />
            <span className="truncate">{label}</span>
        </div>
    );

    if (href && !opacity) {
        return <Link href={href} className="w-full">{content}</Link>;
    }

    return <button className="w-full">{content}</button>;
}
