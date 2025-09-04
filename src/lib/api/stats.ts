import type { ApiResult } from './types';

export type StatsResponse = {
    date: string;
    visits: number;
    mapSearches: number | null;
    coupons: {
        date: string;
        issued: number;
        remaining: number;
        soldOut: boolean;
    };
};



export async function getStatsByDate(date: string): Promise<ApiResult<StatsResponse>> {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
    const url = `${base}/api/v1/admin/stats/daily?date=${encodeURIComponent(date)}`;

    try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) {
            const text = await res.text().catch(() => '');
            return { success: false, data: null, error: text || 'Failed to fetch stats' };
        }
        const raw = await res.json();
        const coupons = raw?.coupons ?? {};
        const data: StatsResponse = {
            date: String(raw?.date ?? date),
            visits: Number(raw?.visits ?? 0),
            mapSearches: raw?.mapSearches == null ? null : Number(raw?.mapSearches),
            coupons: {
                date: String(coupons?.date ?? raw?.date ?? date),
                issued: Number(coupons?.issued ?? 0),
                remaining: Number(coupons?.remaining ?? 0),
                soldOut: Boolean(coupons?.soldOut ?? false),
            },
        };
        return { success: true, data, error: null };
    } catch (e) {
        const msg = e instanceof Error ? e.message : 'Unknown error';
        return { success: false, data: null, error: msg };
    }
}


