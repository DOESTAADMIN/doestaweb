"use client";

import React from 'react';
import { useReservations } from '@/hooks/useReservations';
import { ReservationHeader } from '@/components/reservations/ReservationHeader';
import { ReservationStats } from '@/components/reservations/ReservationStats';
import { ReservationTable } from '@/components/reservations/ReservationTable';

export default function ReservationsPage() {
    const {
        reservations,
        filteredReservations,
        loading,
        refresh
    } = useReservations();

    const handleNewReservation = () => {
        // Future: Open modal or navigate
        window.location.href = '/dashboard/reservations/new';
    };

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            <ReservationHeader
                loading={loading}
                onRefresh={refresh}
                onNewReservation={handleNewReservation}
            />

            <ReservationStats reservations={reservations} />

            <ReservationTable
                reservations={filteredReservations}
                loading={loading}
            />
        </div>
    );
}
