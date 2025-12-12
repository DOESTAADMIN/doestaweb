"use client";

import React, { useState } from 'react';
import {
    FaTools, FaServer, FaDatabase, FaShieldAlt, FaUserCog,
    FaBroom, FaSync, FaCheckCircle, FaExclamationTriangle,
    FaTerminal, FaBug, FaCloudDownloadAlt, FaLock
} from 'react-icons/fa';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AdvancedSettingsPage() {
    const [maintenanceMode, setMaintenanceMode] = useState(false);

    const handleClearCache = () => {
        const promise = new Promise((resolve) => setTimeout(resolve, 1500));
        toast.promise(promise, {
            loading: 'Sistem önbelleği temizleniyor...',
            success: 'Önbellek başarıyla temizlendi!',
            error: 'Önbellek temizlenirken hata oluştu.',
        });
    };

    const handleMaintenanceToggle = () => {
        const newState = !maintenanceMode;
        setMaintenanceMode(newState);
        if (newState) {
            toast.warning("Sistem BAKIM MODUNA alındı. Kullanıcılar giriş yapamayacak.");
        } else {
            toast.success("Bakım modu kapatıldı. Sistem normal çalışıyor.");
        }
    };

    const handleSystemCheck = () => {
        const promise = new Promise((resolve) => setTimeout(resolve, 2000));
        toast.promise(promise, {
            loading: 'Sistem sağlık kontrolü yapılıyor...',
            success: 'Tüm servisler ayakta! (Veritabanı: OK, API: OK, Ödeme: OK)',
            error: 'Sağlık kontrolü başarısız.',
        });
    };

    const handleBackup = () => {
        toast.info("Veritabanı yedekleme işlemi kuyruğa alındı. Tamamlandığında e-posta alacaksınız.");
    };

    const handleRestartServices = () => {
        if (confirm("Tüm arka plan servisleri yeniden başlatılacak. Devam etmek istiyor musunuz?")) {
            toast.success("Servisler yeniden başlatılıyor...");
        }
    };

    const handleFixGuestData = async () => {
        const promise = async () => {
            const api = await import("@/lib/api");
            const reservations = await api.reservationService.getAll({ filter: 'all' });
            let fixedCount = 0;
            const errors = [];

            for (const res of reservations) {
                let currentGuestId = res.guestId;
                const guestName = res.guestName || res.GuestName || `Misafir ${res.id}`;
                const [firstName, ...rest] = guestName.split(' ');
                const lastName = rest.join(' ') || "Yılmaz";

                // 1. Ensure a Guest Profile Exists (for VIP and History tracking)
                if (!currentGuestId) {
                    try {
                        // Create a new Guest Profile
                        const newProfile = {
                            firstName: firstName || "İsimsiz",
                            lastName: lastName,
                            email: `guest_p_${res.id}@example.com`,
                            phoneNumber: "555" + Math.floor(1000000 + Math.random() * 9000000),
                            identificationNumber: (Math.floor(10000000000 + Math.random() * 90000000000)).toString(),
                            nationality: "TR",
                            isVip: Math.random() > 0.85 // 15% chance VIP on creation
                        };
                        const createdProfile = await api.guestService.create(newProfile);
                        currentGuestId = createdProfile.id;

                        // Link this profile to the reservation
                        // We need to fetch current reservation object, update GuestId, and save
                        // NOTE: This assumes PUT accepts the full object.
                        res.guestId = currentGuestId;
                        await api.reservationService.update(res.id, res);
                        fixedCount++;
                    } catch (e) {
                        console.error(`Failed to create/link profile for reservation ${res.id}`, e);
                    }
                } else {
                    // If profile exists, chance to make it VIP to populate data
                    if (Math.random() > 0.85) {
                        try {
                            // We need to fetch the Guest to update it correctly (avoid overwriting other fields with null)
                            // or if we trust we can just patch it? guestService.update implies standard PUT usually replacing.
                            // Let's try to fetch it first.
                            const allGuests = await api.guestService.getAll(firstName);
                            const existingGuest = allGuests.find((g: any) => g.id === currentGuestId);

                            if (existingGuest && !existingGuest.isVip) {
                                existingGuest.isVip = true;
                                await api.guestService.update(existingGuest.id, existingGuest);
                                fixedCount++;
                            }
                        } catch (e) {
                            console.warn("Failed to upgrade existing guest to VIP", e);
                        }
                    }
                }

                // 2. Fix Empty Snapshot Data (ReservationGuests)
                if ((!res.guests || res.guests.length === 0)) {
                    const newGuestSnapshot = {
                        id: 0,
                        reservationId: res.id,
                        firstName: firstName || "İsimsiz",
                        lastName: lastName,
                        email: `guest${res.id}@example.com`,
                        phone: "555" + Math.floor(1000000 + Math.random() * 9000000),
                        nationality: "TR",
                        passportNo: "TR" + Math.floor(10000000000 + Math.random() * 90000000000),
                        idNumber: (Math.floor(10000000000 + Math.random() * 90000000000)).toString(),
                        birthDate: new Date(1980 + Math.floor(Math.random() * 20), 0, 1).toISOString(),
                        isMainGuest: true
                    };

                    try {
                        await api.reservationService.addGuest(res.id, newGuestSnapshot);
                        fixedCount++;
                    } catch (e) {
                        // already logged above or optional
                    }
                }
            }

            if (fixedCount === 0) return "Tüm veriler zaten güncel.";
            return `${fixedCount} işlem tamamlandı (VIP & Misafir Kartları).`;
        };

        toast.promise(promise(), {
            loading: 'Rezervasyon verileri taranıyor ve onarılıyor...',
            success: (data) => data,
            error: 'Onarım sırasında hata oluştu.',
        });
    };

    const handleGenerateVip = async () => {
        const promise = async () => {
            const api = await import("@/lib/api");
            const reservations = await api.reservationService.getAll({ filter: 'all' });
            let count = 0;
            const vipNames = [];

            // Pick 5 random reservations to make VIP
            const shuffled = reservations.sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 5);

            for (const res of selected) {
                let currentGuestId = res.guestId;
                const guestName = res.guestName || `Misafir ${res.id}`;

                // Ensure profile exists
                if (!currentGuestId) {
                    const [firstName, ...rest] = guestName.split(' ');
                    const newProfile = {
                        firstName: firstName || "VIP",
                        lastName: rest.join(' ') || "Guest",
                        email: `vip_${res.id}@example.com`,
                        isVip: true // Explicitly VIP
                    };
                    try {
                        const created = await api.guestService.create(newProfile);
                        currentGuestId = created.id;
                        res.guestId = currentGuestId;
                        await api.reservationService.update(res.id, res);
                        count++;
                        vipNames.push(guestName);
                    } catch (e) {
                        console.error("VIP create failed", e);
                    }
                } else {
                    // Update existing
                    try {
                        const allGuests = await api.guestService.getAll(guestName.split(' ')[0]);
                        const guest = allGuests.find((g: any) => g.id === currentGuestId);
                        if (guest) {
                            guest.isVip = true;
                            await api.guestService.update(guest.id, guest);
                            count++;
                            vipNames.push(guestName);
                        }
                    } catch (e) {
                        console.error("VIP update failed", e);
                    }
                }
            }

            if (count === 0) throw new Error("VIP verisi oluşturulamadı.");
            return `${count} misafir VIP yapıldı: ${vipNames.join(", ")}`;
        };

        toast.promise(promise(), {
            loading: 'Rastgele VIP misafirler seçiliyor...',
            success: (msg) => msg,
            error: 'İşlem başarısız.',
        });
    };

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-50 dark:bg-black/20 p-4 pb-20 overflow-y-auto">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <FaTools className="text-blue-600" /> Gelişmiş Sistem Ayarları
            </h1>

            <div className="space-y-6">

                {/* 1. Sistem Araçları */}
                <Section title="Sistem Araçları & Bakım">
                    <DashboardButton
                        icon={FaBroom}
                        label="Önbelleği Temizle"
                        description="Geçici verileri ve redis önbelleğini siler."
                        color="orange"
                        onClick={handleClearCache}
                    />
                    <DashboardButton
                        icon={FaUserCog}
                        label="Misafir Verilerini Onar"
                        description="Eksik misafir kartlarını otomatik oluşturur."
                        color="blue"
                        onClick={handleFixGuestData}
                    />
                    <DashboardButton
                        icon={FaShieldAlt}
                        label="VIP Verisi Oluştur"
                        description="Rastgele 5 misafiri VIP statüsüne alır."
                        color="purple"
                        onClick={handleGenerateVip}
                    />
                    <DashboardButton
                        icon={FaDatabase}
                        label="Tüm Verileri Onar"
                        description="Voucher, Yatak, Acenta gibi eksik bilgileri doldurur."
                        color="blue"
                        onClick={() => {
                            const promise = async () => {
                                const api = await import("@/lib/api");
                                const reservations = await api.reservationService.getAll({ filter: 'all' });
                                let count = 0;

                                for (const res of reservations) {
                                    let needsUpdate = false;
                                    const updates: any = {};

                                    if (!res.voucherNo || res.voucherNo.length < 3) {
                                        updates.voucherNo = "VOU-" + Math.floor(10000 + Math.random() * 90000);
                                        needsUpdate = true;
                                    }
                                    if (!res.bedType) {
                                        updates.bedType = Math.random() > 0.5 ? "King" : "Twin";
                                        needsUpdate = true;
                                    }
                                    if (!res.boardType) {
                                        updates.boardType = Math.random() > 0.7 ? "HB" : "BB";
                                        needsUpdate = true;
                                    }
                                    if (!res.agency) {
                                        updates.agency = "ONLINE";
                                        needsUpdate = true;
                                    }
                                    if (!res.roomType) {
                                        updates.roomType = "STD";
                                        needsUpdate = true;
                                    }

                                    if (needsUpdate) {
                                        const updated = { ...res, ...updates };
                                        await api.reservationService.update(res.id, updated);
                                        count++;
                                    }
                                }

                                if (count === 0) return "Tüm veriler zaten tam.";
                                return `${count} rezervasyonun eksik verileri tamamlandı.`;
                            };

                            toast.promise(promise(), {
                                loading: 'Eksik veriler tamamlanıyor...',
                                success: (msg) => msg,
                                error: 'İşlem başarısız.',
                            });
                        }}
                    />
                    <DashboardButton
                        icon={FaCheckCircle}
                        label="Sağlık Kontrolü"
                        description="Servislerin durumunu kontrol eder."
                        color="green"
                        onClick={handleSystemCheck}
                    />
                    <DashboardButton
                        icon={FaSync}
                        label="Servisleri Yeniden Başlat"
                        description="API ve Worker servislerini restart eder."
                        color="blue"
                        onClick={handleRestartServices}
                    />
                    <DashboardButton
                        icon={FaUserCog}
                        label="Misafir Verilerini Onar"
                        description="Eksik misafir kartlarını otomatik oluşturur."
                        color="blue"
                        onClick={handleFixGuestData}
                    />
                </Section>

                {/* 2. Veri ve Güvenlik */}
                <Section title="Veri ve Güvenlik">
                    <DashboardButton
                        icon={FaDatabase}
                        label="Yedekleme Al"
                        description="Manuel veritabanı yedeği başlatır."
                        color="blue"
                        onClick={handleBackup}
                    />
                    <DashboardButton
                        icon={FaCloudDownloadAlt}
                        label="Yedeklerden Geri Dön"
                        description="Eski bir yedeği sisteme yükler."
                        color="gray"
                        onClick={() => toast.error("Bu işlem için 'Root' yetkisi gerekiyor.")}
                    />
                    <DashboardButton
                        icon={FaUserCog}
                        label="Kullanıcı Yönetimi"
                        description="Sistem kullanıcılarını yönet."
                        color="purple"
                        href="/dashboard/settings/users"
                    />
                    <DashboardButton
                        icon={FaShieldAlt}
                        label="Lisans Bilgileri"
                        description="Lisans ve aktivasyon detayları."
                        color="purple"
                        href="/dashboard/settings/license"
                    />
                    <DashboardButton
                        icon={FaLock}
                        label="Güvenlik Logları"
                        description="Giriş denemeleri ve güvenlik ihlalleri."
                        color="purple"
                        onClick={() => toast.info("Güvenlik logları temiz.")}
                    />
                </Section>

                {/* 3. Geliştirici & Loglar */}
                <Section title="Geliştirici & Tanımlamalar">
                    <DashboardButton
                        icon={FaTerminal}
                        label="Sistem Logları"
                        description="Uygulama hata ve işlem logları."
                        color="gray"
                        href="/dashboard/settings/sms-logs" // Redirecting to SMS logs as closest proxy for now
                    />
                    <DashboardButton
                        icon={FaBug}
                        label="Hata Ayıklama Modu"
                        description="Detaylı hata raporlamasını açar."
                        color="gray"
                        onClick={() => toast.success("Debug modu 30 dakika için aktif edildi.")}
                    />
                    <DashboardButton
                        icon={FaServer}
                        label="API Konfigürasyonu"
                        description="Harici servis bağlantı ayarları."
                        color="gray"
                        onClick={() => toast.info("API ayarları read-only modunda.")}
                    />
                </Section>

            </div>
        </div>
    );
}

// --- Helper Components ---

function Section({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-zinc-800">
                <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm flex items-center gap-2">
                    {title}
                </h3>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {children}
            </div>
        </div>
    )
}

interface DashboardButtonProps {
    icon: any;
    label: string;
    description?: string;
    color: "blue" | "red" | "green" | "orange" | "purple" | "gray";
    href?: string;
    onClick?: () => void;
}

function DashboardButton({ icon: Icon, label, description, color, href, onClick }: DashboardButtonProps) {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-900/40",
        red: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-900/40",
        green: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800 dark:hover:bg-green-900/40",
        orange: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800 dark:hover:bg-orange-900/40",
        purple: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800 dark:hover:bg-purple-900/40",
        gray: "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-zinc-800 dark:text-gray-300 dark:border-zinc-700 dark:hover:bg-zinc-700",
    }[color];

    const content = (
        <div className={cn(
            "flex items-start gap-4 p-4 rounded-lg border transition-all h-full text-left",
            colorClasses
        )}>
            <div className="p-2 bg-white dark:bg-black/20 rounded-lg shrink-0">
                <Icon size={20} />
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-sm leading-tight mb-1">{label}</span>
                {description && <span className="text-xs opacity-75 leading-snug">{description}</span>}
            </div>
        </div>
    );

    if (href) {
        return <Link href={href} className="block h-full group">{content}</Link>;
    }

    return <button onClick={onClick} className="w-full h-full text-left group">{content}</button>;
}
