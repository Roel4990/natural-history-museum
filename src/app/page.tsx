'use client';

import React, {Suspense, useEffect} from "react";
import {useRouter} from "next/navigation";
import { postVisitMetricVerbose } from "@/lib/api/metrics";

function getTargetMapNumber(): number {
    const today = getKSTToday(); // ✅ 한국 기준
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
    return (
        <main className="flex justify-center items-center min-h-screen bg-white">
            <div
                className="w-full max-w-[480px] mx-auto"
                onClick={() => router.push(`/map/${getTargetMapNumber()}`)}
            >
                <img
                    src="/start_image.png"
                    alt="시작 이미지"
                    className="w-full h-auto object-contain"
                />
            </div>
        </main>
    );
}
