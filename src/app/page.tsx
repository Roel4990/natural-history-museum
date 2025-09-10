'use client';

import React, {Suspense, useEffect} from "react";
import {useRouter} from "next/navigation";
import { postVisitMetricVerbose } from "@/lib/api/metrics";

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
                onClick={() => router.push('/map/1')}
            >
                <img
                    src="/start_image.jpg"
                    alt="시작 이미지"
                    className="w-full h-auto object-contain"
                />
            </div>
        </main>
    );
}
