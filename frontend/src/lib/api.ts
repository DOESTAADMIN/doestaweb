import axios from 'axios';

// Use environment variable if available, otherwise fallback to localhost
// FORCE LOCALHOST to ensure connection works even if env var is stale in running process
const API_URL = 'http://localhost:5085/api'; // process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5085/api';

console.log("Current API_URL (Forced):", API_URL);

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(request => {
    console.log('Starting Request', JSON.stringify(request.url, null, 2));
    return request;
});

api.interceptors.response.use(response => {
    return response;
}, error => {
    console.error("API Error Response:", {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data
    });
    return Promise.reject(error);
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// --- Front Office ---
export const roomService = {
    getAll: async () => {
        const response = await api.get('/rooms');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get(`/rooms/${id}`);
        return response.data;
    },
    create: async (data: any) => {
        const response = await api.post('/rooms', data);
        return response.data;
    },
    update: async (id: number, data: any) => {
        const response = await api.put(`/rooms/${id}`, data);
        return response.data;
    },
    delete: async (id: number) => {
        const response = await api.delete(`/rooms/${id}`);
        return response.data;
    },

    // Room Plan
    getRoomPlan: async (filters?: { floor?: string; type?: string; status?: string }) => {
        const response = await api.get('/rooms/room-plan', { params: filters });
        return response.data;
    },

    // --- Definitions ---
    getBedTypes: () => api.get('/bedtypes').then(r => r.data),
    getBoardTypes: () => api.get('/boardtypes').then(r => r.data),
    getPriceTypes: () => api.get('/pricetypes').then(r => r.data),
    getRevenueGroups: () => api.get('/revenuegroups').then(r => r.data),
    getCurrencies: () => api.get('/currencies').then(r => r.data),

    seed: async () => {
        const response = await api.post('/rooms/seed');
        return response.data;
    },
    updateStatus: async (id: number, status: string) => {
        const response = await api.put(`/rooms/${id}/status`, JSON.stringify(status));
        return response.data;
    },
    bulkUpdateStatus: async (roomIds: number[], status: string) => {
        const response = await api.post('/rooms/bulk-status', { roomIds, status });
        return response.data;
    }
};

// --- Reservation Types ---
export interface ReservationGuest {
    id: number;
    reservationId?: number;
    title?: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    gender?: string;
    nationality?: string;
    birthDate?: string; // string for JSON date format
    birthPlace?: string;
    idNumber?: string;
    idValidDate?: string;
    idIssueDate?: string;
    passportNo?: string;
    passportValidDate?: string;
    passportIssueDate?: string;
    phone?: string;
    email?: string;
    carPlate?: string;
    address?: string; // Backend does not have City/Country yet but requested
    isMainGuest: boolean;
    isVip?: boolean;
    isBlacklist?: boolean;
    kvkkConsent?: boolean;
    phoneContactConsent?: boolean;
    emailContactConsent?: boolean;
    notes?: string;
}
export interface ReservationDailyPrice {
    id: number;
    reservationId: number;
    date: string;
    price: number;
    currency: string;
    roomType: string;
    boardType: string;
}

export interface FolioTransaction {
    id: number;
    reservationId: number;
    date: string;
    description: string;
    departmentCode: string;
    debit: number;
    credit: number;
    currency: string;
    createdBy: string;
}

export interface ReservationNote {
    id: number;
    reservationId: number;
    message: string;
    createdAt: string;
    createdBy: string;
    isActive: boolean;
}

export interface ReservationRequest {
    id: number;
    reservationId: number;
    type: string; // Request, Complaint, Task
    status: string; // New, InProcess, Completed, Cancelled
    department: string;
    subDepartment?: string;
    title: string;
    description: string;
    priority?: string;
    assignedTo?: string;
    device?: string;
    area?: string;
    createdAt: string;
    expectedEndDate?: string;
    actualEndDate?: string;
    startedAt?: string;
    createdBy: string;
    notes?: string;
    guestRating?: number;
}

export interface ReservationLog {
    id: number;
    reservationId?: number;
    module: string;
    action: string;
    description: string;
    date: string;
    user: string;
}

export interface Room {
    id: number;
    name: string;
    number: string;
    type: string;
    status: string;
    price: number;
    bedType?: string;
}

export interface Reservation {
    id: number;
    roomId: number;
    room?: Room;
    checkInDate: string;
    checkOutDate: string;

    // Details
    agency: string;
    voucherNo: string;
    boardType: string;
    roomType: string;
    nationality: string;

    adultCount: number;
    childCount: number;
    babyCount: number;

    status: string;
    totalPrice: number;
    currency: string;
    isPaid: boolean;
    paidAmount: number;
    note: string;

    // UI Parity Fields
    saleType?: string;
    payer?: string;
    bedType?: string;
    trackingCode?: string;
    createdAt?: string;

    // Marketing
    marketSegment?: string;
    source?: string;
    specials?: string;

    guestId?: number;
    guestName: string;

    // Collections
    guests?: ReservationGuest[];
    dailyPrices?: ReservationDailyPrice[];
    folioTransactions?: FolioTransaction[];
    notes?: ReservationNote[];
    requests?: ReservationRequest[];

    // Pricing & Other Fields
    contractType?: string;
    priceType?: string;
    manualPriceActive?: boolean;
    manualDailyPrice?: number; // UI only field mostly
    exchangeRate?: number;
    exchangeDate?: string;

    applyTax?: string;
    taxIncluded?: string;
    taxAccount?: string;

    discountActive?: boolean;
    discountType?: string;

    invoiceTitle?: string;
    invoiceAddress?: string;
    taxOffice?: string;
    taxNumber?: string;
    invoiceTaxType?: string;

    realCheckInDate?: string;
    realCheckOutDate?: string;
    saleDate?: string;
    qTime?: string;
}

export const reservationService = {
    getAll: async (params: any = {}) => {
        const query = new URLSearchParams();
        if (params.status) query.append("status", params.status);
        if (params.filter) query.append("filter", params.filter);

        const url = `${API_URL}/reservations?${query}`;
        console.log("Fetching reservations from:", url);

        try {
            const res = await fetch(url);
            if (!res.ok) {
                console.error(`Fetch failed: ${res.status} ${res.statusText} for ${url}`);
                throw new Error("Failed to fetch reservations");
            }
            return res.json();
        } catch (error) {
            console.error("Network error in getAll:", error);
            throw error;
        }
    },
    getById: async (id: number) => {
        const res = await fetch(`${API_URL}/reservations/${id}`);
        if (!res.ok) throw new Error("Failed to fetch reservation");
        return res.json();
    },
    create: async (data: Partial<Reservation>) => {
        const res = await fetch(`${API_URL}/reservations`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to create reservation");
        return res.json();
    },
    update: async (id: number, data: any) => {
        // Ensure decimal/float fields are numbers
        if (data.totalPrice) data.totalPrice = parseFloat(data.totalPrice);
        if (data.paidAmount) data.paidAmount = parseFloat(data.paidAmount);

        const res = await fetch(`${API_URL}/reservations/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to update reservation");
    },
    delete: async (id: number) => {
        const res = await fetch(`${API_URL}/reservations/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete reservation");
    },
    recalculatePrice: async (id: number, manualDailyPrice?: number) => {
        const res = await fetch(`${API_URL}/reservations/${id}/recalculate-price`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(manualDailyPrice),
        });
        if (!res.ok) throw new Error("Failed to recalculate price");
        return res.json();
    },
    checkIn: async (id: number) => {
        const res = await fetch(`${API_URL}/reservations/${id}/checkin`, { method: "POST" });
        if (!res.ok) throw new Error("Failed to check in");
        return res.json();
    },
    checkOut: async (id: number) => {
        const res = await fetch(`${API_URL}/reservations/${id}/checkout`, { method: "POST" });
        if (!res.ok) throw new Error("Failed to check out");
        return res.json();
    },
    generateDemoData: async (id: number) => {
        const res = await fetch(`${API_URL}/reservations/${id}/demo-data`, { method: "POST" });
        if (!res.ok) throw new Error("Failed to generate demo data");
        return res.json();
    },
    getHistory: async (id: number) => {
        const res = await fetch(`${API_URL}/reservations/${id}/history`);
        if (!res.ok) throw new Error("Failed to fetch history");
        return res.json();
    },
    // Sub-resources
    addGuest: async (id: number, guest: Partial<ReservationGuest>) => {
        const res = await fetch(`${API_URL}/reservations/${id}/guests`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(guest),
        });
        if (!res.ok) throw new Error("Failed to add guest");
        return res.json();
    },
    updateGuest: async (guestId: number, guest: Partial<ReservationGuest>) => {
        const res = await fetch(`${API_URL}/reservations/guests/${guestId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(guest),
        });
        if (!res.ok) throw new Error("Failed to update guest");
    },
    removeGuest: async (guestId: number) => {
        const res = await fetch(`${API_URL}/reservations/guests/${guestId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to remove guest");
    },
    addFolioTransaction: async (id: number, transaction: Partial<FolioTransaction>) => {
        const res = await fetch(`${API_URL}/reservations/${id}/folio`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(transaction),
        });
        if (!res.ok) throw new Error("Failed to add transaction");
        return res.json();
    },
    deleteFolioTransaction: async (transactionId: number) => {
        const res = await fetch(`${API_URL}/reservations/folio/${transactionId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete transaction");
    },

    // Notes
    addNote: async (id: number, note: Partial<ReservationNote>) => {
        const res = await fetch(`${API_URL}/reservations/${id}/notes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(note),
        });
        if (!res.ok) throw new Error("Failed to add note");
        return res.json();
    },
    deleteNote: async (noteId: number) => {
        const res = await fetch(`${API_URL}/reservations/notes/${noteId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete note");
    },

    // Requests
    addRequest: async (reservationId: number, data: any) => {
        const res = await fetch(`${API_URL}/reservations/${reservationId}/requests`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to add request");
        return res.json();
    },
    updateRequest: async (requestId: number, data: any) => {
        const res = await fetch(`${API_URL}/reservations/requests/${requestId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to update request");
    },
    deleteRequest: async (requestId: number) => {
        const res = await fetch(`${API_URL}/reservations/requests/${requestId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete request");
    }
};

export const guestService = {
    getAll: async (search?: string) => {
        const response = await api.get('/guests', { params: { search } });
        return response.data;
    },
    create: async (data: any) => {
        const response = await api.post('/guests', data);
        return response.data;
    },
    update: async (id: number, data: any) => {
        const response = await api.put(`/guests/${id}`, data);
        return response.data;
    },
    updateGuest: async (id: number, data: any) => {
        const response = await api.put(`/reservations/guests/${id}`, data);
        return response.data;
    }
};

export interface ChannelStat {
    channelName: string;
    reservationCount: number;
    totalRevenue: number;
    adr: number;
}

export const distributionService = {
    getChannelStats: async (startDate?: string, endDate?: string) => {
        const params: any = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        const response = await api.get('/distribution/channels', { params });
        return response.data;
    }
};

// --- POS & Restaurant ---
export const productService = {
    getAll: (categoryId?: number, search?: string) => api.get('/products', { params: { categoryId, search } }),
    getCategories: () => api.get('/products/categories'),
    create: (data: any) => api.post('/products', data),
    seed: () => api.post('/products/seed', {}),
};

export const posTableService = {
    getAll: () => api.get('/postables'),
    create: (data: any) => api.post('/postables', data),
    update: (id: number, data: any) => api.put(`/postables/${id}`, data),
    seed: () => api.post('/postables/seed', {}),
};

export const posOrderService = {
    getAll: (status?: string) => api.get('/posorders', { params: { status } }),
    create: (data: any) => api.post('/posorders', data),
    addItem: (orderId: number, item: any) => api.post(`/posorders/${orderId}/items`, item),
    pay: (orderId: number) => api.post(`/posorders/${orderId}/pay`, {}),
};

// --- Accounting ---
export const accountService = {
    getAll: (type?: string) => api.get('/accounts', { params: { type } }),
    create: (data: any) => api.post('/accounts', data),
    seed: () => api.post('/accounts/seed', {}),
};

export const invoiceService = {
    getAll: (type?: string) => api.get('/invoices', { params: { type } }),
    create: (data: any) => api.post('/invoices', data),
};

// --- Stock ---
export const stockService = {
    getWarehouses: () => api.get('/stock/warehouses'),
    getInventory: (warehouseId?: number) => api.get('/stock/inventory', { params: { warehouseId } }),
    seed: () => api.post('/stock/seed', {}),
};

// --- Sales ---
export const agencyService = {
    getAll: async () => {
        const res = await api.get('/agencies');
        return res.data;
    },
    getById: async (id: number) => {
        const res = await api.get(`/agencies/${id}`);
        return res.data;
    },
    create: async (data: any) => {
        const res = await api.post('/agencies', data);
        return res.data;
    },
    update: async (id: number, data: any) => {
        const res = await api.put(`/agencies/${id}`, data);
        return res.data;
    },
    delete: async (id: number) => {
        const res = await api.delete(`/agencies/${id}`);
        return res.data;
    },
    seed: async () => {
        // Optional if we want explicit seeding
        return true;
    }
};

export const rateService = {
    getAll: () => api.get('/rates'),
    seed: () => api.post('/rates/seed', {}),
    getMatrix: async (startDate: string, endDate: string) => {
        const res = await api.get('/rates/matrix', { params: { startDate, endDate } });
        return res.data;
    },
    updateDaily: async (data: { roomTypeId: number, date: string, price?: number, stopSell?: boolean }) => {
        const res = await api.post('/rates/update-daily', data);
        return res.data;
    },
    seedMatrix: async () => {
        const res = await api.post('/rates/seed-matrix');
        return res.data;
    }
};




export const dashboardService = {
    getStats: (forecastStartDate?: string) => {
        const query = forecastStartDate ? `?forecastStartDate=${forecastStartDate}` : '';
        return api.get(`/dashboard/stats${query}`);
    },
};


export const reportService = {
    getRevenue: () => api.get('/reports/revenue'),
    getOccupancy: () => api.get('/reports/occupancy'),
    getSummary: () => api.get('/reports/summary'),
};

export const analyticsService = {
    getMarket: async () => {
        const res = await fetch(`${API_URL}/analytics/distribution/market`);
        if (!res.ok) throw new Error("Failed to fetch market analytics");
        return res.json();
    },
    getChannels: async () => {
        const res = await fetch(`${API_URL}/analytics/distribution/channels`);
        if (!res.ok) throw new Error("Failed to fetch channel analytics");
        return res.json();
    },
    getGeo: async () => {
        const res = await fetch(`${API_URL}/analytics/distribution/geo`);
        if (!res.ok) throw new Error("Failed to fetch geo analytics");
        return res.json();
    },
    // Operational Reports
    getOccupancy: async (start: string, end: string) => {
        const res = await fetch(`${API_URL}/analytics/reports/occupancy?start=${start}&end=${end}`);
        if (!res.ok) throw new Error("Failed to fetch occupancy report");
        return res.json();
    },
    getForecast: async (start: string, end: string) => {
        const res = await fetch(`${API_URL}/analytics/reports/forecast?start=${start}&end=${end}`);
        if (!res.ok) throw new Error("Failed to fetch forecast report");
        return res.json();
    },
    getFuture: async (date?: string) => {
        const query = date ? `?date=${date}` : "";
        const res = await fetch(`${API_URL}/analytics/reports/future${query}`);
        if (!res.ok) throw new Error("Failed to fetch future report");
        return res.json();
    },
    getManagement: async () => {
        const res = await fetch(`${API_URL}/analytics/reports/management`);
        if (!res.ok) throw new Error("Failed to fetch management report");
        return res.json();
    },
    // System
    getLogs: async (params: any = {}) => {
        const query = new URLSearchParams();
        if (params.module) query.append("module", params.module);
        if (params.user) query.append("user", params.user);
        if (params.action) query.append("action", params.action);
        if (params.limit) query.append("limit", params.limit.toString());
        if (params.startDate) query.append("startDate", params.startDate);
        if (params.endDate) query.append("endDate", params.endDate);

        const res = await fetch(`${API_URL}/logs?${query.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch logs");
        return res.json();
    },
    getUsers: async () => {
        const res = await fetch(`${API_URL}/users`);
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
    },
    createUser: async (data: any) => {
        const res = await fetch(`${API_URL}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("Failed to create user");
        return res.json();
    },
    updateUser: async (id: number, data: any) => {
        const res = await fetch(`${API_URL}/users/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("Failed to update user");
        return true;
    },
    deleteUser: async (id: number) => {
        const res = await fetch(`${API_URL}/users/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete user");
        return true;
    }
};

export default api;
