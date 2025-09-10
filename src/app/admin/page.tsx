'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStatsByDate } from '@/lib/api/stats';
import type { ApiResult } from '@/lib/api/types';
import {StatsResponse} from "@/app/type";
import {exportToExcel} from "@/app/admin/exportToExcel";


function formatTodayISO(): string {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

async function fetchStats(date: string): Promise<StatsResponse> {
    try {
        const res: ApiResult<StatsResponse> = await getStatsByDate(date);
        if (!res.success || !res.data) throw new Error(res.error || 'fail');
        return res.data;
    } catch {
        return {
            date,
            visits: 0,
            hourly: [],
            coupons: {
                issueCount: 0,
                remaining: 200,
                soldOut: false,
            },
        };
    }
}

export default function AdminPage() {
    const [selectedDate, setSelectedDate] = useState<string>(formatTodayISO());

    const queryKey = useMemo(() => ['stats-by-date', selectedDate], [selectedDate]);
    const { data, isLoading, isError, refetch, isFetching } = useQuery({
        queryKey,
        queryFn: () => fetchStats(selectedDate),
    });

    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto w-full max-w-3xl px-4 py-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-gray-900">관리자 통계</h1>
                    <button
                        onClick={() => exportToExcel(data!)}
                        className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-md text-sm font-medium"
                    >
                        엑셀 다운로드
                    </button>
                </div>
                {/* Date picker */}
                <div className="flex items-center gap-3 mb-6">
                    <input
                        type="date"
                        value={selectedDate}
                        max={formatTodayISO()}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
                    />
                </div>

                {/* 상태 표시 */}
                {isLoading ? (
                    <div className="text-gray-700">불러오는 중...</div>
                ) : isError ? (
                    <div className="text-red-600">데이터를 불러오지 못했습니다.</div>
                ) : (
                    <div className="space-y-4">
                        {/* 요약 카드 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-white rounded-xl border p-4 shadow-sm">
                                <div className="text-sm text-gray-500">날짜</div>
                                <div className="text-lg font-semibold text-gray-900">{data?.date}</div>
                            </div>
                            <div className="bg-white rounded-xl border p-4 shadow-sm">
                                <div className="text-sm text-gray-500">방문 수</div>
                                <div className="text-2xl font-bold text-gray-900">{data?.visits ?? 0}</div>
                            </div>
                            <div className="bg-white rounded-xl border p-4 shadow-sm">
                                <div className="text-sm text-gray-500">발행/잔여</div>
                                <div
                                    className="text-2xl font-bold text-gray-900">{data?.coupons.issueCount ?? 0} / {data?.coupons.remaining ?? 0}</div>
                            </div>
                        </div>
                        {/* 시간대별 방문자 수 */}
                        <div>
                            <h3 className="text-md font-semibold text-gray-700 mb-2">시간대별 방문자 수</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {data?.hourly?.map(({hour, visits}) => {
                                    const startHour = String(hour).padStart(2, "0");
                                    const endHour = String(hour + 1).padStart(2, "0");
                                    return (
                                        <div
                                            key={hour}
                                            className="bg-white rounded-xl border p-4 shadow-sm flex flex-col items-center"
                                        >
                                            <div className="text-sm text-gray-500">{startHour}:00 ~ {endHour}:00</div>
                                            <div className="text-xl font-bold text-gray-900">{visits}명</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


