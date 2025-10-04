'use client';

import React, { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { postVisitMetricVerbose } from "@/lib/api/metrics";
import { useQuery } from "@tanstack/react-query";
import { formatTodayISO } from "../../lib/utils/date";
import { getStatsByDate } from "@/lib/api/stats";
import { isEventDay } from "../../lib/utils/isEventDay";
import { isBeforeEleven, isAfterThree } from "../../lib/utils/isPrizeTime";

function PageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const selectedDate = formatTodayISO();
    const sortNum = searchParams.get('sortNum');
    const validSortNums = ['1', '2', '3', '4'];
    const targetMap = sortNum && validSortNums.includes(sortNum) ? sortNum : '1';

    useEffect(() => {
        const hallMapping: { [key: string]: string } = {
            '1': 'A',
            '2': 'B',
            '3': 'C',
            '4': 'D',
        };
        const hall = hallMapping[targetMap];

        if (!hall) return;

        let cancelled = false;
        (async () => {
            const ok = await postVisitMetricVerbose({ hall });
            if (!cancelled) {
                console.log(`[visit: ${hall}]:`, ok ? 'success' : 'fail');
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [targetMap]);

    const { data, isLoading } = useQuery({
        queryKey: ['stats', selectedDate],
        queryFn: () => getStatsByDate(selectedDate)
    });

    const isSoldOut = data?.data?.coupons?.soldOut ?? false;
    const isTodayEventDay = isEventDay();
    const isNowBeforeEleven = isBeforeEleven();
    const isNowAfterThree = isAfterThree();
    console.log("isNowAfterThree", isNowAfterThree);
    console.log("isNowBeforeEleven", isNowBeforeEleven);
    const getImageSrc = () => {
        // 평일인 경우
        if (!isTodayEventDay) {
            return `/map_${targetMap}/event_weekdays_screen_${targetMap}.jpg`;
        }
        // 주말인데 오전 11시 이전인 경우
        if (isNowBeforeEleven) {
            return `/map_${targetMap}/event_${targetMap}_before_11.jpg`;
        }
        // 주말인데 오후 3시 이후인 경우
        if (isNowAfterThree) {
            return `/map_${targetMap}/event_end_screen_${targetMap}.jpg`;
        }
        // 조건은 만족하지만 다 팔렸을 경우
        if (isSoldOut) {
            return `/map_${targetMap}/event_end_screen_${targetMap}.jpg`;
        }
        // 상품이 소진되지 않고 경품 추천일이고 11 ~ 15시 사이인 경우
        return `/map_${targetMap}/event_start_screen_${targetMap}.jpg`;
    };

    const getImageAlt = () => {
        // 평일인 경우
        if (!isTodayEventDay) {
            return "평일 이벤트 이미지";
        }
        // 주말인데 오전 11시 이전인 경우
        if (isNowBeforeEleven) {
            return "오전 11시 이전 이미지";
        }
        // 주말인데 오후 3시 이후인 경우
        if (isNowAfterThree) {
            return "오후 3시 이후 이미지";
        }
        // 조건은 만족하지만 다 팔렸을 경우
        if (isSoldOut) {
            return "쿠폰 소진 이미지";
        }
        return "시작 이미지";
    };

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
                onClick={() => {
                    if (isNowBeforeEleven) return;
                    router.push(`/map/${targetMap}`);
                }}
            >
                <img
                    src={getImageSrc()}
                    alt={getImageAlt()}
                    className="w-full h-auto object-contain"
                />
            </div>
        </main>
    );
}

export default function Home() {
    return (
        <Suspense fallback={
            <main className="flex justify-center items-center min-h-screen bg-white">
                <p className="text-gray-400">로딩 중...</p>
            </main>
        }>
            <PageContent />
        </Suspense>
    );
}
