"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FaUser, FaBed, FaMoneyBillWave, FaCreditCard, FaCheck } from "react-icons/fa";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/utils";

type ReservationInputs = {
    // Step 1: Guest Info
    firstName: string;
    lastName: string;
    identityNumber: string;
    phone: string;
    email: string;
    nationality: string;
    notes: string;

    // Step 2: Stay Details
    checkInDate: string;
    checkOutDate: string;
    roomType: string;
    roomNumber: string;
    adults: number;
    children: number;
    specialRequests: string[];

    // Step 3: Pricing
    roomRate: number;
    extras: string[];

    // Step 4: Payment
    paymentMethod: string;
    prepayment: number;
};

const STEPS = [
    { id: 1, title: "Misafir Bilgileri", icon: FaUser },
    { id: 2, title: "Konaklama", icon: FaBed },
    { id: 3, title: "Fiyatlandırma", icon: FaMoneyBillWave },
    { id: 4, title: "Ödeme", icon: FaCreditCard },
];

export default function NewReservationForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const { register, handleSubmit, watch, formState: { errors } } = useForm<ReservationInputs>({
        defaultValues: {
            nationality: "TR",
            roomType: "standard",
            adults: 1,
            children: 0,
            paymentMethod: "credit_card",
            roomRate: 1500, // mock base price
        }
    });

    const onSubmit: SubmitHandler<ReservationInputs> = (data) => {
        console.log("Form Data:", data);
        alert("Rezervasyon başarıyla oluşturuldu! (Simüle)");
    };

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    // Calculated fields for preview
    const checkIn = watch("checkInDate");
    const checkOut = watch("checkOutDate");
    const roomRate = watch("roomRate");

    const calculateTotal = () => {
        if (!checkIn || !checkOut) return 0;
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return (diffDays || 1) * (roomRate || 0);
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 flex flex-col h-full">
            {/* Stepper Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                    {STEPS.map((step, index) => (
                        <div key={step.id} className="flex-1 flex flex-col items-center relative">
                            <div
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all z-10",
                                    currentStep >= step.id
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/20"
                                        : "bg-gray-200 text-gray-500 dark:bg-zinc-800 dark:text-gray-400"
                                )}
                            >
                                <step.icon size={16} />
                            </div>
                            <span className={cn(
                                "mt-2 text-xs font-semibold uppercase tracking-wider",
                                currentStep >= step.id ? "text-blue-600 dark:text-blue-400" : "text-gray-400"
                            )}>
                                {step.title}
                            </span>
                            {/* Connector Line */}
                            {index !== STEPS.length - 1 && (
                                <div
                                    className={cn(
                                        "absolute top-5 left-1/2 w-full h-0.5 -z-0",
                                        currentStep > step.id ? "bg-blue-600" : "bg-gray-200 dark:bg-zinc-800"
                                    )}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 p-8 overflow-y-auto">

                {/* Step 1: Guest Info */}
                {currentStep === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right-4 fade-in duration-300">
                        <Input
                            label="Ad"
                            placeholder="Ahmet"
                            {...register("firstName", { required: "Ad zorunludur" })}
                            error={errors.firstName?.message}
                        />
                        <Input
                            label="Soyad"
                            placeholder="Yılmaz"
                            {...register("lastName", { required: "Soyad zorunludur" })}
                            error={errors.lastName?.message}
                        />
                        <Input
                            label="TC Kimlik No / Pasaport No"
                            placeholder="11111111111"
                            {...register("identityNumber", { required: "Kimlik No zorunludur" })}
                            error={errors.identityNumber?.message}
                        />
                        <Input
                            label="Telefon"
                            placeholder="+90 5XX XXX XX XX"
                            {...register("phone", { required: "Telefon zorunludur" })}
                            error={errors.phone?.message}
                        />
                        <Input
                            label="E-posta"
                            type="email"
                            placeholder="ornek@email.com"
                            {...register("email", { required: "E-posta zorunludur" })}
                            error={errors.email?.message}
                        />
                        <Select
                            label="Uyruk"
                            options={[{ label: "Türkiye", value: "TR" }, { label: "Diğer", value: "OTHER" }]}
                            {...register("nationality")}
                        />
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notlar</label>
                            <textarea
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                rows={3}
                                {...register("notes")}
                            />
                        </div>
                    </div>
                )}

                {/* Step 2: Stay Details */}
                {currentStep === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right-4 fade-in duration-300">
                        <Input
                            label="Giriş Tarihi"
                            type="date"
                            {...register("checkInDate", { required: "Giriş tarihi zorunludur" })}
                            error={errors.checkInDate?.message}
                        />
                        <Input
                            label="Çıkış Tarihi"
                            type="date"
                            {...register("checkOutDate", { required: "Çıkış tarihi zorunludur" })}
                            error={errors.checkOutDate?.message}
                        />
                        <Select
                            label="Oda Tipi"
                            options={[
                                { label: "Standart Oda", value: "standard" },
                                { label: "Deluxe Oda", value: "deluxe" },
                                { label: "Suite", value: "suite" },
                                { label: "Family", value: "family" },
                            ]}
                            {...register("roomType")}
                        />
                        <Select
                            label="Oda Numarası"
                            options={[
                                { label: "Otomatik Ata", value: "" },
                                { label: "201 - Müsait", value: "201" },
                                { label: "202 - Müsait", value: "202" },
                                { label: "305 - Müsait", value: "305" },
                            ]}
                            {...register("roomNumber")}
                        />
                        <div className="flex gap-4">
                            <Input
                                label="Yetişkin"
                                type="number"
                                min={1}
                                {...register("adults")}
                            />
                            <Input
                                label="Çocuk"
                                type="number"
                                min={0}
                                {...register("children")}
                            />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Özel İstekler</label>
                            <div className="flex flex-wrap gap-3">
                                {["Sigara İçilmeyen", "Yüksek Kat", "Deniz Manzara", "Sessiz Oda"].map(req => (
                                    <label key={req} className="flex items-center space-x-2 p-2 border border-gray-200 dark:border-zinc-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800">
                                        <input type="checkbox" value={req} {...register("specialRequests")} className="rounded text-blue-600 focus:ring-blue-500" />
                                        <span className="text-sm dark:text-gray-300">{req}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Pricing */}
                {currentStep === 3 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Gecelik Oda Fiyatı (TL)"
                                type="number"
                                {...register("roomRate")}
                            />
                            <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700">
                                <p className="text-sm text-gray-500">Tahmini Toplam Tutar</p>
                                <p className="text-3xl font-bold text-blue-600">₺{calculateTotal().toLocaleString('tr-TR')}</p>
                                <p className="text-xs text-gray-400 mt-1">{checkIn} - {checkOut} arası</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ekstra Hizmetler</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { name: "Havalimanı Transfer", price: 300 },
                                    { name: "Kahvaltı Dahil", price: 450 },
                                    { name: "Ekstra Yatak", price: 200 }
                                ].map((service) => (
                                    <label key={service.name} className="flex items-center justify-between p-3 border border-gray-200 dark:border-zinc-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800">
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" value={service.name} {...register("extras")} className="rounded text-blue-600 focus:ring-blue-500" />
                                            <span className="text-sm font-medium dark:text-gray-200">{service.name}</span>
                                        </div>
                                        <span className="text-sm text-gray-500">+₺{service.price}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Payment */}
                {currentStep === 4 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right-4 fade-in duration-300">
                        <Select
                            label="Ödeme Yöntemi"
                            options={[
                                { label: "Kredi Kartı", value: "credit_card" },
                                { label: "Nakit", value: "cash" },
                                { label: "Banka Havalesi", value: "bank_transfer" },
                            ]}
                            {...register("paymentMethod")}
                        />
                        <Input
                            label="Ön Ödeme (Kapora)"
                            type="number"
                            placeholder="0.00"
                            {...register("prepayment")}
                        />

                        <div className="md:col-span-2 p-6 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-xl flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                                <FaCheck className="text-green-600 text-2xl" />
                            </div>
                            <h3 className="text-lg font-bold text-green-800 dark:text-green-400">Rezervasyon Özeti Hazır</h3>
                            <p className="text-sm text-green-700 dark:text-green-500 max-w-md mt-2">
                                Bilgileri kontrol edip onayladığınızda rezervasyon sisteme kaydedilecek ve misafire (opsiyonel) bilgilendirme gönderilecektir.
                            </p>
                        </div>
                    </div>
                )}
            </form>

            {/* Stepper Footer Action Buttons */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex justify-between">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    Geri
                </button>

                {currentStep < 4 ? (
                    <button
                        onClick={nextStep}
                        className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md shadow-blue-200 dark:shadow-blue-900/20 transition-all flex items-center gap-2"
                    >
                        İleri
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit(onSubmit)}
                        className="px-8 py-2.5 text-sm font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-md shadow-green-200 dark:shadow-green-900/20 transition-all flex items-center gap-2"
                    >
                        Rezervasyonu Tamamla
                    </button>
                )}
            </div>
        </div>
    );
}
