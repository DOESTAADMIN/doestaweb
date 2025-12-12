"use client";

import { useState, useEffect } from "react";
import { FaHamburger, FaCoffee, FaIceCream, FaTrash, FaSave, FaCreditCard, FaPrint, FaSearch } from "react-icons/fa";
import { productService, posTableService, posOrderService } from "@/lib/api";

interface Product {
    id: number;
    name: string;
    price: number;
    category: { id: number; name: string };
    categoryId: number;
    description?: string;
    unit?: string;
}

interface Category {
    id: number;
    name: string;
}

interface OrderItem {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
}

export default function PosPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [basket, setBasket] = useState<OrderItem[]>([]);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    // Load initial data
    useEffect(() => {
        loadData();
    }, []);

    // Load products when category changes
    useEffect(() => {
        loadProducts();
    }, [selectedCategory]);

    const loadData = async () => {
        try {
            const catRes = await productService.getCategories();
            setCategories(catRes.data);
            if (catRes.data.length > 0) setSelectedCategory(catRes.data[0].id);
        } catch (error) {
            console.error("Failed to load categories", error);
        }
    };

    const loadProducts = async () => {
        try {
            // If no category selected yet, don't fetch or fetch all
            const res = await productService.getAll(selectedCategory || undefined);
            setProducts(res.data);
        } catch (error) {
            console.error("Failed to load products", error);
        }
    };

    const addToBasket = (product: Product) => {
        const existing = basket.find(item => item.productId === product.id);
        if (existing) {
            setBasket(basket.map(item =>
                item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            setBasket([...basket, {
                productId: product.id,
                productName: product.name,
                quantity: 1,
                price: product.price
            }]);
        }
    };

    const removeFromBasket = (productId: number) => {
        setBasket(basket.filter(item => item.productId !== productId));
    };

    const calculateTotal = () => {
        return basket.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleCreateOrder = async () => {
        if (basket.length === 0) return;

        try {
            // Create Order
            const orderData = {
                status: "Open",
                totalAmount: calculateTotal(),
                items: [] // In a real scenario, we might create order then items, or deep insert
            };

            const res = await posOrderService.create(orderData);
            const orderId = res.data.id;

            // Add Items One by One (Parallel is better but keep simple)
            for (const item of basket) {
                await posOrderService.addItem(orderId, {
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.price
                });
            }

            alert(`Sipariş #${orderId} oluşturuldu!`);
            setBasket([]);
        } catch (error) {
            console.error("Order failed", error);
            alert("Sipariş oluşturulamadı!");
        }
    };

    return (
        <div className="flex h-[calc(100vh-6rem)] gap-4">
            {/* Left Side: Categories & Menu */}
            <div className="flex-1 flex flex-col gap-4">
                {/* Categories */}
                <div className="flex gap-2 check-scroll overflow-x-auto pb-2">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-4 py-3 rounded-xl whitespace-nowrap min-w-[100px] flex flex-col items-center gap-2 font-bold transition-all ${!selectedCategory ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-white dark:bg-zinc-800 hover:bg-gray-50'}`}
                    >
                        <FaSearch />
                        <span>Tümü</span>
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-4 py-3 rounded-xl whitespace-nowrap min-w-[100px] flex flex-col items-center gap-2 font-bold transition-all ${selectedCategory === cat.id ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800'}`}
                        >
                            {/* Icons based on name or generic */}
                            {cat.name.includes("Drink") ? <FaCoffee /> : cat.name.includes("Dessert") ? <FaIceCream /> : <FaHamburger />}
                            <span>{cat.name}</span>
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto pr-2">
                    {products.map(product => (
                        <div
                            key={product.id}
                            onClick={() => addToBasket(product)}
                            className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                                {product.price} ₺
                            </div>
                            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-1 mt-2">{product.name}</h3>
                            <p className="text-xs text-gray-400 line-clamp-2">{product.unit || 'Adet'}</p>
                        </div>
                    ))}
                    {products.length === 0 && (
                        <div className="col-span-4 text-center text-gray-400 py-10">
                            Bu kategoride ürün bulunamadı.
                        </div>
                    )}
                </div>
            </div>

            {/* Right Side: Order Basket */}
            <div className="w-96 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 flex flex-col">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-800/50 rounded-t-xl">
                    <div>
                        <h2 className="font-bold text-gray-800 dark:text-white">Yeni Sipariş</h2>
                        <p className="text-xs text-green-600 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Online
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-500">Masa</div>
                        <div className="font-bold text-lg text-blue-600">A-12</div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {basket.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
                            <FaHamburger size={48} className="mb-2" />
                            <p>Sepet Boş</p>
                        </div>
                    ) : (
                        basket.map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-zinc-800/30 rounded-lg group hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                        {item.quantity}x
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm text-gray-800 dark:text-gray-200">{item.productName}</div>
                                        <div className="text-xs text-gray-400">{item.price} ₺</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-gray-900 dark:text-white">{item.price * item.quantity} ₺</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeFromBasket(item.productId); }}
                                        className="text-gray-300 hover:text-red-500 p-1"
                                    >
                                        <FaTrash size={12} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 border-t border-gray-100 dark:border-gray-800 rounded-b-xl">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-500">Ara Toplam</span>
                        <span className="font-bold">{calculateTotal()} ₺</span>
                    </div>
                    <div className="flex justify-between items-center mb-6 text-xl">
                        <span className="font-bold text-gray-800 dark:text-white">GENEL TOPLAM</span>
                        <span className="font-bold text-blue-600">{calculateTotal()} ₺</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-bold hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <FaPrint /> Yazdır
                        </button>
                        <button
                            onClick={handleCreateOrder}
                            disabled={basket.length === 0}
                            className="bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <FaSave /> Kaydet
                        </button>
                    </div>
                </div>
            </div>

            <button className="fixed bottom-4 left-4 bg-gray-800 text-white p-2 rounded text-xs opacity-50 hover:opacity-100" onClick={() => productService.seed().then(() => loadData())}>
                Demo Veri Yükle (Seed)
            </button>
        </div>
    );
}
