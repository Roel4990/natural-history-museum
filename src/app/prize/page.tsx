'use client';

import { useState } from "react";
import {useRouter} from "next/navigation";

export default function PrizePage() {
    const [prizeCode, setPrizeCode] = useState<string>("09.06.001");
    const router = useRouter();
    return (
        <div
            onClick={() => router.push("/")}
            className="relative w-full h-screen bg-gradient-to-b from-[#F27067] to-[#D91D52]"
        >
            {/* 전체 배경 이미지 */}
            <img
                src="/prize_recommendation.png"
                alt="prize background"
                className="absolute max-w-[600px]  inset-0 w-full h-full object-cover"
            />

            {/* 중앙 텍스트 */}
            <div className="absolute inset-0 flex flex-col items-center gap-7">
                <h1 className="text-6xl md:text-8xl font-extrabold text-yellow-300 mt-10">
                    경품교환권
                </h1>
                <h2 className="text-6xl md:text-7xl font-extrabold text-yellow-300">
                    {prizeCode}
                </h2>
            </div>
        </div>
    );
}
