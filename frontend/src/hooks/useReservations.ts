import { useState, useEffect, useCallback } from 'react';
import { reservationService, Room } from '@/lib/api';

export interface Reservation {
    id: number;
    guestName: string;
    agency: string;
    checkIn: string;
    checkOut: string;
    room?: Room; // Updated to Room object
    status: 'Confirmed' | 'CheckedIn' | 'CheckedOut' | 'Cancelled' | 'NoShow';
    balance: number;
    currency: string;
    pax: string;
    voucher?: string;
    board?: string;
    guestId?: number;
    note?: string;

    // New fields
    saleType?: string;
    payer?: string;
    bedType?: string;
    trackingCode?: string;
    createdAt?: string;
    roomType?: string;
}

export function useReservations(filterStatus?: string, filterType?: string) {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchReservations = useCallback(async () => {
        setLoading(true);
        try {
            // Build query params
            const params: any = {};
            if (filterStatus) params.status = filterStatus;
            if (filterType) params.filter = filterType;

            const data = await reservationService.getAll(params);

            if (Array.isArray(data)) {
                const mapped = data.map((r: any) => ({
                    id: r.id,
                    guestName: r.guest?.firstName ? `${r.guest.firstName} ${r.guest.lastName}` : r.guestName,
                    guestId: r.guestId,
                    agency: r.agency || 'Direct',
                    checkIn: r.checkInDate, // Assume ISO string
                    checkOut: r.checkOutDate,
                    room: r.room, // Map full Room object
                    status: r.status,
                    balance: r.totalPrice - (r.paidAmount || 0),
                    currency: r.currency || 'EUR',
                    pax: `${r.adultCount || 1} Ad ${r.childCount || 0} Ch`,
                    voucher: r.voucherNo,
                    board: r.boardType,
                    note: r.note,

                    // New mapped fields
                    saleType: r.saleType,
                    payer: r.payer,
                    bedType: r.bedType,
                    trackingCode: r.trackingCode,
                    createdAt: r.createdAt,
                    roomType: r.roomType
                }));
                setReservations(mapped);
                setError(null);
            }
        } catch (err) {
            console.error("API Fetch Failed", err);
            setError("Failed to load reservations.");
        } finally {
            setLoading(false);
        }
    }, [filterStatus, filterType]);

    const addReservation = async (reservation: any) => {
        try {
            await reservationService.create(reservation);
            fetchReservations();
        } catch (e) { throw e; }
    };

    const checkIn = async (id: number) => {
        try { await reservationService.checkIn(id); fetchReservations(); } catch (e) { throw e; }
    };

    const checkOut = async (id: number) => {
        try { await reservationService.checkOut(id); fetchReservations(); } catch (e) { throw e; }
    };

    const cancel = async (id: number) => {
        try {
            await reservationService.update(id, { status: 'Cancelled' });
            fetchReservations();
        } catch (e) { throw e; }
    };

    const remove = async (id: number) => {
        try {
            // Mock delete if no endpoint, or assume ID deletion
            await reservationService.update(id, { status: 'Cancelled' }); // Soft delete typical
            fetchReservations();
        } catch (e) { throw e; }
    };

    useEffect(() => {
        fetchReservations();
    }, [fetchReservations]);

    return {
        reservations,
        loading,
        error,
        refresh: fetchReservations,
        addReservation,
        checkIn,
        checkOut,
        cancel,
        remove
    };
}
