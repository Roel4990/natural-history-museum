'use client';

import React, {Suspense, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import { postVisitMetricVerbose } from "@/lib/api/metrics";
import {useQuery} from "@tanstack/react-query";
import {formatTodayISO} from "@/uils/date";
import {getStatsByDate} from "@/lib/api/stats";

function getTargetMapNumber(): number {
    const today = getKSTToday();
    console.log(today)
    const oct4 = new Date(2025, 9, 4);
    const nov1 = new Date(2025, 10, 1);
    const dec6 = new Date(2025, 11, 6);

    if (today < oct4) return 2;
    if (today < nov1) return 1;
    if (today < dec6) return 3;
    return 4;
}

function getKSTToday(): Date {
    const now = new Date();
    const kst = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
    return new Date(kst.getFullYear(), kst.getMonth(), kst.getDate()); // 시간 제거
}

export default function Home() {
    const router = useRouter();
    const selectedDate = formatTodayISO();
    useEffect(() => {
        let cancelled = false;
        (async () => {
            const ok = await postVisitMetricVerbose();
            if (!cancelled) {
                console.log('[visit]:', ok ? 'success' : 'fail');
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);
    const {
        data,
        isLoading,
        isError
    } = useQuery({
        queryKey: ['stats', selectedDate],
        queryFn: () => getStatsByDate(selectedDate)
    });
    const isSoldOut = data?.data?.coupons?.soldOut ?? false;

    if (isLoading) {
        return (
            <main className="flex justify-center items-center min-h-screen bg-white">
                <p className="text-gray-400">로딩 중...</p>
            </main>
        );
    }

    return (
        <main className="flex justify-center items-center min-h-screen bg-white">
            <div
                className="w-full max-w-[480px] mx-auto"
                onClick={() => router.push(`/map/${getTargetMapNumber()}`)}
            >
                <img
                    src={isSoldOut ? "/start_image_end.jpg" : "/start_image.png"}
                    alt={isSoldOut ? "쿠폰 소진 이미지" : "시작 이미지"}
                    className="w-full h-auto object-contain"
                />
            </div>
        </main>
    );
}
