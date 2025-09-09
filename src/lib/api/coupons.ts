export type IssueCouponResponse = {
    date: string;        // ISO date: "2025-09-06"
    issued: number;      // 1~200
    remaining: number;   // 잔여 수량
    soldOut: boolean;    // 품절 여부
};

import type { ApiResult } from './types';

export async function issueCouponRequest(): Promise<ApiResult<IssueCouponResponse>> {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
    const url = `${base}/api/v1/coupons/issue`;
    console.log(url)
    try {
        const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
        console.log("res:", res);

        if (!res.ok) {
            const text = await res.text().catch(() => '');
            return { success: false, data: null, error: text || '쿠폰 발급 요청 실패' };
        }

        const json = await res.json();
        console.log(json)
        return json
    } catch (err) {
        console.error("fetch error:", err);
    }

}


