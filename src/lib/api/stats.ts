import type { ApiResult } from './types';
import {StatsResponse} from "@/app/type";

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
        const data: StatsResponse = {
            date: String(raw?.data.date ?? date),
            visits: raw?.data.visits ?? { ALL: 0, A: 0, B: 0, C: 0, D: 0 },
            hourly: raw?.data.hourly ?? { ALL: [], A: [], B: [], C: [], D: [] },
            coupons: raw?.data.coupons ?? { issueCount: 0, remaining: 0, soldOut: false },
        };
        return { success: true, data, error: null };
    } catch (e) {
        const msg = e instanceof Error ? e.message : 'Unknown error';
        return { success: false, data: null, error: msg };
    }
}


