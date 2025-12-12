"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaPlus, FaTrash, FaSave, FaCopy, FaCalendarAlt } from "react-icons/fa";
import { toast } from "sonner"; // Assuming sonner is used, or alert
import { useRouter } from "next/navigation";

// Types matching Backend
interface ContractPrice {
    roomType: string;
    boardType: string;
    priceType: string;
    singlePrice: number;
    doublePrice: number;
    triplePrice: number;
    quadPrice: number;
    extraBedPrice: number;
    babyPrice: number; // 0-1.99
    childPrice: number; // 2-5.99
    teenPrice: number; // 6-11.99
}

interface ContractPeriod {
    name: string;
    startDate: string;
    endDate: string;
    prices: ContractPrice[];
}

interface ContractFormData {
    agencyId: string; // string for select
    name: string;
    code: string;
    currency: string;
    periods: ContractPeriod[];
}

export default function ContractWizardPage() {
    const router = useRouter();
    const [agencies, setAgencies] = useState<any[]>([]);
    const [roomTypes, setRoomTypes] = useState<any[]>([]);
    const [boardTypes, setBoardTypes] = useState<any[]>([]);
    const [activePeriodIndex, setActivePeriodIndex] = useState(0);

    const form = useForm<ContractFormData>({
        defaultValues: {
            name: "New Contract 2025",
            code: "",
            currency: "EUR",
            periods: [
                {
                    name: "Yeni Dönem 1",
                    startDate: new Date().toISOString().split('T')[0],
                    endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
                    prices: [] // Will be populated based on room types
                }
            ]
        }
    });

    const { register, control, handleSubmit, watch, setValue, getValues } = form;
    const { fields: periodFields, append: appendPeriod, remove: removePeriod } = useFieldArray({
        control,
        name: "periods"
    });

    // Mock Fetch Data (Replace with real API calls)
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Agencies
                const agRes = await fetch("http://localhost:5001/api/agencies");
                if (agRes.ok) setAgencies(await agRes.json());

                // Fetch Room Types (Mocking for now if API not ready or empty)
                // const rtRes = await fetch("http://localhost:5001/api/roomtypes");
                // if (rtRes.ok) setRoomTypes(await rtRes.json());
                setRoomTypes([
                    { code: "STD", name: "Standart Oda" },
                    { code: "DLX", name: "Deluxe Oda" },
                    { code: "FAM", name: "Aile Odası" }
                ]);

                setBoardTypes(["BB", "HB", "FB", "AI"]);

            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };
        fetchData();
    }, []);

    // Initialize prices for a period if empty
    useEffect(() => {
        const periods = getValues("periods");
        periods.forEach((period, idx) => {
            if (period.prices.length === 0 && roomTypes.length > 0) {
                const initialPrices = roomTypes.map(rt => ({
                    roomType: rt.code,
                    boardType: "BB",
                    priceType: "Refundable",
                    singlePrice: 100,
                    doublePrice: 150,
                    triplePrice: 200,
                    quadPrice: 250,
                    extraBedPrice: 50,
                    babyPrice: 0,
                    childPrice: 25,
                    teenPrice: 50
                }));
                setValue(`periods.${idx}.prices`, initialPrices);
            }
        });
    }, [roomTypes, periodFields]);

    const onSubmit = async (data: ContractFormData) => {
        try {
            const payload = {
                ...data,
                agencyId: parseInt(data.agencyId),
                // Ensure dates are valid ISO
            };

            const res = await fetch("http://localhost:5001/api/contracts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                // toast.success("Kontrat başarıyla oluşturuldu!");
                alert("Kontrat başarıyla oluşturuldu!");
                router.push("/dashboard/contract/details"); // Go to list
            } else {
                const err = await res.text();
                alert("Hata oluştu: " + err);
            }
        } catch (e) {
            console.error(e);
            alert("Sunucu hatası.");
        }
    };

    const currentPrices = watch(`periods.${activePeriodIndex}.prices`) || [];

    return (
        <div className="h-full flex flex-col bg-gray-50 dark:bg-zinc-950">
            {/* Header / Toolbar */}
            <div className="border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-white">Yeni Kontrat</h1>
                    <div className="h-6 w-px bg-gray-300"></div>
                    <div className="flex items-center gap-2">
                        <Label>Acente:</Label>
                        <Controller
                            control={control}
                            name="agencyId"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="w-[200px] h-8">
                                        <SelectValue placeholder="Seçiniz..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {agencies.map(a => (
                                            <SelectItem key={a.id} value={a.id.toString()}>{a.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Label>Kod:</Label>
                        <Input {...register("code")} className="h-8 w-32" placeholder="Ex: WINTER2025" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Label>Kur:</Label>
                        <Input {...register("currency")} className="h-8 w-20" placeholder="EUR" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.back()}>İptal</Button>
                    <Button onClick={handleSubmit(onSubmit)} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                        <FaSave /> Kaydet
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-[1600px] mx-auto space-y-6">

                    {/* Integration Toggle */}
                    <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-100 dark:border-blue-800">
                        <Label>Online Satış Kanallarıyla Entegrasyon</Label>
                        <Switch />
                    </div>

                    {/* Periods Tabs */}
                    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800">
                        <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-gray-50/50">
                            <div className="flex items-center gap-2 overflow-x-auto">
                                {periodFields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        onClick={() => setActivePeriodIndex(index)}
                                        className={`cursor-pointer px-4 py-2 rounded-md border text-sm flex items-center gap-2 transition-colors ${activePeriodIndex === index
                                                ? "bg-white border-blue-500 text-blue-600 shadow-sm"
                                                : "bg-gray-100 border-transparent text-gray-500 hover:bg-gray-200"
                                            }`}
                                    >
                                        <FaCalendarAlt />
                                        <span>{watch(`periods.${index}.name`) || `Dönem ${index + 1}`}</span>
                                        {periodFields.length > 1 && (
                                            <FaTrash
                                                className="hover:text-red-500 ml-2 text-xs"
                                                onClick={(e) => { e.stopPropagation(); removePeriod(index); setActivePeriodIndex(Math.max(0, index - 1)); }}
                                            />
                                        )}
                                    </div>
                                ))}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-2 text-blue-600"
                                    onClick={() => appendPeriod({
                                        name: `Yeni Dönem ${periodFields.length + 1}`,
                                        startDate: new Date().toISOString().split('T')[0],
                                        endDate: new Date().toISOString().split('T')[0],
                                        prices: [] // Logic will populate
                                    })}
                                >
                                    <FaPlus /> Yeni Dönem Ekle
                                </Button>
                            </div>
                        </div>

                        {/* Active Period Content */}
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-4 gap-4 items-end">
                                <div className="grid gap-2">
                                    <Label>Dönem Adı</Label>
                                    <Input {...register(`periods.${activePeriodIndex}.name`)} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Başlangıç</Label>
                                    <Input type="date" {...register(`periods.${activePeriodIndex}.startDate`)} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Bitiş</Label>
                                    <Input type="date" {...register(`periods.${activePeriodIndex}.endDate`)} />
                                </div>
                            </div>

                            {/* Pricing Matrix */}
                            <div className="border rounded-md overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 font-medium">
                                            <tr>
                                                <th className="p-3 min-w-[120px]">Oda Tipi</th>
                                                <th className="p-3 min-w-[100px]">Pansiyon</th>
                                                <th className="p-3 min-w-[120px]">Fiyat Tipi</th>
                                                <th className="p-3 min-w-[80px]">Single</th>
                                                <th className="p-3 min-w-[80px]">Double</th>
                                                <th className="p-3 min-w-[80px]">Triple</th>
                                                <th className="p-3 min-w-[80px]">Quad</th>
                                                <th className="p-3 min-w-[80px]">Eks.Yatak</th>
                                                <th className="p-3 min-w-[80px] bg-blue-50/50">Bbk (0-2)</th>
                                                <th className="p-3 min-w-[80px] bg-blue-50/50">Çck (3-6)</th>
                                                <th className="p-3 min-w-[80px] bg-blue-50/50">Gnç (7-12)</th>
                                                <th className="p-3 w-10"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
                                            {currentPrices.map((price, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-zinc-900/50">
                                                    <td className="p-2">
                                                        <select
                                                            {...register(`periods.${activePeriodIndex}.prices.${idx}.roomType`)}
                                                            className="w-full h-8 px-2 border rounded-md bg-transparent"
                                                        >
                                                            {roomTypes.map(rt => <option key={rt.code} value={rt.code}>{rt.name}</option>)}
                                                        </select>
                                                    </td>
                                                    <td className="p-2">
                                                        <select
                                                            {...register(`periods.${activePeriodIndex}.prices.${idx}.boardType`)}
                                                            className="w-full h-8 px-2 border rounded-md bg-transparent"
                                                        >
                                                            {boardTypes.map(bt => <option key={bt} value={bt}>{bt}</option>)}
                                                        </select>
                                                    </td>
                                                    <td className="p-2">
                                                        <Input {...register(`periods.${activePeriodIndex}.prices.${idx}.priceType`)} className="h-8" />
                                                    </td>
                                                    <td className="p-2"><Input type="number" {...register(`periods.${activePeriodIndex}.prices.${idx}.singlePrice`)} className="h-8" /></td>
                                                    <td className="p-2"><Input type="number" {...register(`periods.${activePeriodIndex}.prices.${idx}.doublePrice`)} className="h-8 font-bold text-blue-600" /></td>
                                                    <td className="p-2"><Input type="number" {...register(`periods.${activePeriodIndex}.prices.${idx}.triplePrice`)} className="h-8" /></td>
                                                    <td className="p-2"><Input type="number" {...register(`periods.${activePeriodIndex}.prices.${idx}.quadPrice`)} className="h-8" /></td>
                                                    <td className="p-2"><Input type="number" {...register(`periods.${activePeriodIndex}.prices.${idx}.extraBedPrice`)} className="h-8" /></td>
                                                    <td className="p-2 bg-blue-50/20"><Input type="number" {...register(`periods.${activePeriodIndex}.prices.${idx}.babyPrice`)} className="h-8" /></td>
                                                    <td className="p-2 bg-blue-50/20"><Input type="number" {...register(`periods.${activePeriodIndex}.prices.${idx}.childPrice`)} className="h-8" /></td>
                                                    <td className="p-2 bg-blue-50/20"><Input type="number" {...register(`periods.${activePeriodIndex}.prices.${idx}.teenPrice`)} className="h-8" /></td>
                                                    <td className="p-2 text-center">
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"><FaCopy /></Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="p-2 bg-gray-50 border-t border-gray-200">
                                        <Button variant="outline" size="sm" className="gap-2 w-full border-dashed"
                                            onClick={() => {
                                                const prices = getValues(`periods.${activePeriodIndex}.prices`);
                                                setValue(`periods.${activePeriodIndex}.prices`, [
                                                    ...prices,
                                                    {
                                                        roomType: roomTypes[0]?.code || "",
                                                        boardType: "BB",
                                                        priceType: "Refundable",
                                                        singlePrice: 0, doublePrice: 0, triplePrice: 0, quadPrice: 0, extraBedPrice: 0,
                                                        babyPrice: 0, childPrice: 0, teenPrice: 0
                                                    }
                                                ]);
                                            }}
                                        >
                                            <FaPlus /> Yeni Satır Ekle
                                        </Button>
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
