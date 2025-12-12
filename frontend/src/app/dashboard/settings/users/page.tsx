"use strict";
"use client";

import { useEffect, useState } from "react";
import { analyticsService } from "@/lib/api";
import {
    Users, Plus, Trash2, Shield, Key, MoreHorizontal, UserCheck, UserX, User as UserIcon,
    Lock, CheckSquare, Clock, AlertCircle, Edit3, X, Save, History as HistoryIcon
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface PermissionConfig {
    [module: string]: {
        view: boolean;
        edit: boolean;
        delete: boolean;
    }
}

interface User {
    id: number;
    username: string;
    fullName: string;
    role: string;
    pinCode: string;
    isActive: boolean;
    permissions: string; // JSON
    createdAt: string;
}

const DEFAULT_PERMISSIONS: PermissionConfig = {
    "reservations": { view: true, edit: false, delete: false },
    "guests": { view: true, edit: false, delete: false },
    "reports": { view: false, edit: false, delete: false },
    "settings": { view: false, edit: false, delete: false },
};

const MODULES = [
    { key: "reservations", label: "Rezervasyonlar" },
    { key: "guests", label: "Misafir Profilleri" },
    { key: "reports", label: "Raporlar & Analiz" },
    { key: "settings", label: "Sistem Ayarları" },
];

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    // Form State
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'permissions' | 'activity'>('profile');
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [userLogs, setUserLogs] = useState<any[]>([]);
    const [logsLoading, setLogsLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        password: "", // Empty means no change on update
        fullName: "",
        role: "User",
        pinCode: "",
        isActive: true,
        permissions: JSON.stringify(DEFAULT_PERMISSIONS)
    });

    // Permission State (parsed)
    const [permState, setPermState] = useState<PermissionConfig>(DEFAULT_PERMISSIONS);

    useEffect(() => {
        loadUsers();
    }, []);

    // Also update permState when formData.permissions string changes (e.g. loading user)
    useEffect(() => {
        try {
            setPermState(JSON.parse(formData.permissions));
        } catch {
            setPermState(DEFAULT_PERMISSIONS);
        }
    }, [formData.permissions]);

    useEffect(() => {
        if (activeTab === 'activity' && editingUser?.username) {
            setLogsLoading(true);
            analyticsService.getLogs({ user: editingUser.username, limit: 50 })
                .then(res => setUserLogs(res))
                .catch(() => toast.error("Geçmiş hareketler yüklenemedi."))
                .finally(() => setLogsLoading(false));
        }
    }, [activeTab, editingUser]);

    const loadUsers = () => {
        setLoading(true);
        analyticsService.getUsers().then(res => {
            setUsers(res);
            setLoading(false);
        }).catch(() => {
            toast.error("Kullanıcı listesi yüklenemedi.");
            setLoading(false);
        });
    };

    const handleOpenModal = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                username: user.username,
                password: "", // Keep empty
                fullName: user.fullName,
                role: user.role,
                pinCode: user.pinCode,
                isActive: user.isActive,
                permissions: user.permissions || JSON.stringify(DEFAULT_PERMISSIONS)
            });
        } else {
            setEditingUser(null);
            setFormData({
                username: "",
                password: "",
                fullName: "",
                role: "User",
                pinCode: "",
                isActive: true,
                permissions: JSON.stringify(DEFAULT_PERMISSIONS)
            });
        }
        setActiveTab('profile');
        setModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Sync permission state to json string
        const finalData = {
            ...formData,
            permissions: JSON.stringify(permState)
        };

        try {
            if (editingUser) {
                await analyticsService.updateUser(editingUser.id, finalData);
                toast.success("Kullanıcı güncellendi.");
            } else {
                if (!finalData.password) {
                    toast.error("Yeni kullanıcı için şifre zorunludur.");
                    return;
                }
                await analyticsService.createUser(finalData);
                toast.success("Kullanıcı oluşturuldu.");
            }
            setModalOpen(false);
            loadUsers();
        } catch (err) {
            toast.error("İşlem başarısız oldu. Lütfen tekrar deneyin.");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) return;
        try {
            await analyticsService.deleteUser(id);
            toast.success("Kullanıcı silindi.");
            loadUsers();
        } catch (error) {
            toast.error("Silme işlemi başarısız.");
        }
    };

    const togglePermission = (module: string, type: 'view' | 'edit' | 'delete') => {
        setPermState(prev => ({
            ...prev,
            [module]: {
                ...prev[module],
                [type]: !prev[module]?.[type]
            }
        }));
    };

    return (
        <div className="bg-slate-50 min-h-screen p-8 text-slate-800 font-sans">
            {/* Header */}
            <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3 uppercase tracking-tight">
                        <Users className="text-indigo-600" /> Personel Yönetimi
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Sistem erişim yetkileri, güvenlik politikaları ve personel profilleri.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm transition-all shadow-indigo-200"
                >
                    <Plus size={18} /> YENİ PROFİL OLUŞTUR
                </button>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-20">
                    <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-slate-500 text-sm">Kullanıcı verileri yükleniyor...</p>
                </div>
            )}

            {/* Users Grid */}
            {!loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {users.map(user => (
                        <div key={user.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden group hover:border-indigo-300 hover:shadow-md transition-all relative">
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleOpenModal(user)} className="p-2 bg-white rounded-full text-slate-400 hover:text-indigo-600 border border-slate-200 shadow-sm">
                                    <Edit3 size={14} />
                                </button>
                            </div>

                            {/* Card Header (Status & Role) */}
                            <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex justify-between items-center">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${user.role === 'Admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                    {user.role}
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-300'}`}></div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{user.isActive ? 'AKTİF' : 'PASİF'}</span>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-6 flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border-4 border-white shadow-lg flex items-center justify-center text-slate-500 font-bold text-2xl mb-4">
                                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : '?'}
                                </div>

                                <h3 className="font-bold text-slate-900 text-lg mb-0.5">{user.fullName}</h3>
                                <p className="text-xs text-slate-500 font-medium mb-6 flex items-center gap-1">
                                    <Key size={10} /> @{user.username}
                                </p>

                                {/* Quick Stats Grid */}
                                <div className="grid grid-cols-2 gap-3 w-full">
                                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100/50">
                                        <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">PIN Kodu</p>
                                        <div className="flex justify-center gap-1">
                                            {[1, 2, 3, 4].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>)}
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100/50">
                                        <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Kayıt</p>
                                        <p className="text-[10px] font-bold text-slate-600">
                                            {format(new Date(user.createdAt), 'dd MMM yy', { locale: tr })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Card Footer Actions */}
                            <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex gap-2">
                                <button
                                    onClick={() => handleOpenModal(user)}
                                    className="flex-1 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors shadow-sm"
                                >
                                    DÜZENLE
                                </button>
                                <button
                                    onClick={() => handleDelete(user.id)}
                                    className="w-9 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 transition-colors shadow-sm group/del"
                                >
                                    <Trash2 size={16} className="group-hover/del:scale-110 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="bg-slate-50 px-8 py-5 border-b border-slate-200 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    {editingUser ? <Edit3 className="text-indigo-600" size={24} /> : <Plus className="text-emerald-600" size={24} />}
                                    {editingUser ? `Profili Düzenle: ${editingUser.fullName}` : 'Yeni Personel Profili'}
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">Personel bilgilerini, giriş güvenlik ayarlarını ve yetki matrisini yapılandırın.</p>
                            </div>
                            <button onClick={() => setModalOpen(false)} className="bg-white p-2 rounded-full text-slate-400 hover:text-slate-600 border border-transparent hover:border-slate-200 transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex flex-1 overflow-hidden">
                            {/* Sidebar Tabs */}
                            <div className="w-64 bg-slate-50 border-r border-slate-200 p-4 flex flex-col gap-2">
                                <TabButton id="profile" label="Profil Bilgileri" description="Kişisel bilgiler ve rol" icon={<UserIcon size={18} />} active={activeTab} set={setActiveTab} />
                                <TabButton id="security" label="Güvenlik & Erişim" description="Şifre, PIN ve durum" icon={<Lock size={18} />} active={activeTab} set={setActiveTab} />
                                <TabButton id="permissions" label="Yetki Matrisi" description="Modül bazlı kısıtlamalar" icon={<Shield size={18} />} active={activeTab} set={setActiveTab} />
                                {editingUser && (
                                    <TabButton id="activity" label="Son Hareketler" description="İşlem geçmişi logları" icon={<HistoryIcon size={18} />} active={activeTab} set={setActiveTab} />
                                )}
                            </div>

                            {/* Modal Body */}
                            <div className="flex-1 p-8 overflow-y-auto bg-white">
                                <form id="userForm" onSubmit={handleSubmit} className="max-w-xl mx-auto">
                                    {activeTab === 'profile' && (
                                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 text-blue-700 text-sm mb-6">
                                                <div className="bg-blue-100 p-2 rounded-lg h-fit">
                                                    <AlertCircle size={20} className="text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-bold mb-1">Personel Rolü Hakkında</p>
                                                    <p className="opacity-90">"Admin" rolü tüm yetkilere sahiptir ve Yetki Matrisi kısıtlamalarından etkilenmemektedir.</p>
                                                </div>
                                            </div>

                                            <InputGroup label="Ad Soyad" placeholder="Örn: Ahmet Yılmaz" value={formData.fullName} onChange={(e: any) => setFormData({ ...formData, fullName: e.target.value })} required />

                                            <div className="grid grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Departman / Rol</label>
                                                    <select
                                                        className="w-full border border-slate-300 rounded-lg p-3 bg-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
                                                        value={formData.role}
                                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                    >
                                                        <option value="User">User (Standart)</option>
                                                        <option value="Manager">Manager (Yönetici)</option>
                                                        <option value="Admin">Admin (Süper Yönetici)</option>
                                                    </select>
                                                </div>
                                                <InputGroup label="Unvan (Opsiyonel)" placeholder="Resepsiyonist vb." />
                                            </div>

                                            <div className="pt-4 border-t border-slate-100">
                                                <label className="flex items-center gap-3 cursor-pointer group bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                        checked={formData.isActive}
                                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                                    />
                                                    <div>
                                                        <span className="block text-sm font-bold text-slate-800">Hesap Aktif</span>
                                                        <span className="block text-xs text-slate-500">Bu personel sisteme giriş yapabilsin</span>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'security' && (
                                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                            <div className="grid grid-cols-2 gap-6">
                                                <InputGroup label="Kullanıcı Adı" placeholder="ahmet.y" value={formData.username} onChange={(e: any) => setFormData({ ...formData, username: e.target.value })} required />
                                                <InputGroup label="PIN Kodu (Hızlı Erişim)" placeholder="1234" maxLength={4} value={formData.pinCode} onChange={(e: any) => setFormData({ ...formData, pinCode: e.target.value })} />
                                            </div>

                                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                                    <Key size={16} /> Şifre Belirleme
                                                </h3>
                                                <InputGroup
                                                    label={editingUser ? "Yeni Şifre (Değiştirmek istemiyorsanız boş bırakın)" : "Şifre"}
                                                    type="password"
                                                    placeholder="******"
                                                    helperText="En az 6 karakter, harf ve rakam içermelidir."
                                                    value={formData.password}
                                                    onChange={(e: any) => setFormData({ ...formData, password: e.target.value })}
                                                    required={!editingUser}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'permissions' && (
                                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                            {formData.role === 'Admin' ? (
                                                <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                                                    <Shield size={48} className="text-purple-300 mb-4" />
                                                    <h3 className="text-lg font-bold text-slate-700">Tam Erişim Yetkisi</h3>
                                                    <p className="text-sm text-slate-500 max-w-xs mt-2">Admin rolüne sahip kullanıcılar için özel yetkilendirme yapılmasına gerek yoktur. Sistemin tüm modüllerine tam erişime sahiptirler.</p>
                                                </div>
                                            ) : (
                                                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                                    <table className="w-full text-sm text-left">
                                                        <thead className="bg-slate-50 text-xs text-slate-500 font-bold uppercase border-b border-slate-200">
                                                            <tr>
                                                                <th className="px-6 py-4">Modül / İşlev</th>
                                                                <th className="px-4 py-4 text-center w-24">Görüntüleme</th>
                                                                <th className="px-4 py-4 text-center w-24">Düzenleme</th>
                                                                <th className="px-4 py-4 text-center w-24">Silme</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100 bg-white">
                                                            {MODULES.map((mod) => (
                                                                <tr key={mod.key} className="hover:bg-slate-50/50 transition-colors">
                                                                    <td className="px-6 py-4 font-bold text-slate-700">{mod.label}</td>
                                                                    {['view', 'edit', 'delete'].map((type: any) => (
                                                                        <td key={type} className="px-4 py-4 text-center">
                                                                            <label className="inline-flex items-center justify-center cursor-pointer relative">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="peer sr-only"
                                                                                    checked={permState[mod.key]?.[type as 'view'] || false}
                                                                                    onChange={() => togglePermission(mod.key, type)}
                                                                                />
                                                                                <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all flex items-center justify-center">
                                                                                    <CheckSquare size={12} className="text-white opacity-0 peer-checked:opacity-100" />
                                                                                </div>
                                                                            </label>
                                                                        </td>
                                                                    ))}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'activity' && (
                                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-bold text-slate-800">Son 50 Hareket</h3>
                                                <p className="text-xs text-slate-500">Bu kullanıcının sistemdeki son işlemleri</p>
                                            </div>

                                            {logsLoading ? (
                                                <div className="text-center py-10">
                                                    <div className="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                                                    <p className="text-xs text-slate-500">Kayıtlar getiriliyor...</p>
                                                </div>
                                            ) : userLogs.length === 0 ? (
                                                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                                    <p className="text-sm text-slate-400 font-medium">Kayıtlı hareket bulunamadı.</p>
                                                </div>
                                            ) : (
                                                <div className="border border-slate-200 rounded-xl overflow-hidden">
                                                    <table className="w-full text-xs text-left">
                                                        <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase">
                                                            <tr>
                                                                <th className="px-4 py-3">Zaman</th>
                                                                <th className="px-4 py-3">Modül</th>
                                                                <th className="px-4 py-3">İşlem</th>
                                                                <th className="px-4 py-3">Detay</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100 bg-white">
                                                            {userLogs.map((log: any) => (
                                                                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                                                    <td className="px-4 py-2.5 font-mono text-slate-500">
                                                                        {format(new Date(log.date), 'dd.MM HH:mm')}
                                                                    </td>
                                                                    <td className="px-4 py-2.5 font-bold text-slate-600">{log.module}</td>
                                                                    <td className="px-4 py-2.5">
                                                                        <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 font-bold text-[10px] uppercase">
                                                                            {log.action}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-4 py-2.5 text-slate-500 truncate max-w-[200px]" title={log.description}>
                                                                        {log.description}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-8 py-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-4">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-6 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
                            >
                                VAZGEÇ
                            </button>
                            <button
                                onClick={(e) => {
                                    const form = document.getElementById('userForm') as HTMLFormElement;
                                    if (form.reportValidity()) form.requestSubmit();
                                }}
                                className="px-8 py-2.5 rounded-lg bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all flex items-center gap-2"
                            >
                                <Save size={18} /> KAYDET
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function TabButton({ id, label, description, icon, active, set }: any) {
    const isActive = active === id;
    return (
        <button
            type="button"
            onClick={() => set(id)}
            className={`w-full text-left p-3 rounded-lg flex items-start gap-3 transition-all ${isActive ? 'bg-indigo-50 ring-1 ring-indigo-200' : 'hover:bg-slate-100'}`}
        >
            <div className={`p-2 rounded-md ${isActive ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 border border-slate-200'}`}>
                {icon}
            </div>
            <div>
                <span className={`block text-sm font-bold ${isActive ? 'text-indigo-900' : 'text-slate-700'}`}>{label}</span>
                <span className={`block text-[10px] ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>{description}</span>
            </div>
        </button>
    );
}

function InputGroup({ label, helperText, ...props }: any) {
    return (
        <div className="w-full">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{label}</label>
            <input
                className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:bg-slate-100 disabled:text-slate-400 placeholder:text-slate-300 shadow-sm"
                {...props}
            />
            {helperText && <p className="text-xs text-slate-400 mt-1.5">{helperText}</p>}
        </div>
    );
}
