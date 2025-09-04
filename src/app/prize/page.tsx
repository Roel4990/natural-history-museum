'use client';

import {useRef, useState} from "react";
import {useRouter} from "next/navigation";
import html2canvas from "html2canvas";

export default function PrizePage() {
    const [prizeCode, setPrizeCode] = useState<string>("09.06.001");
    const router = useRouter();
    const captureRef = useRef<HTMLDivElement | null>(null);
    const handleDownload = async () => {
        const el = captureRef.current;
        if (!el) return;
        // html2canvas로 DOM 캡처
        const canvas = await html2canvas(el, {
            useCORS: true,       // 외부 이미지 캡처 가능하게
            scale: 2,            // 해상도 업 (선택)
            backgroundColor: '#F27067', // 배경색 명시적 설정
            allowTaint: true,    // 외부 리소스 허용
            foreignObjectRendering: true, // 외부 객체 렌더링 허용
        });
        const dataUrl = canvas.toDataURL("image/png");

        // 다운로드 트리거
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "prize.png";
        link.click();
    };
    return (
        <div className="relative w-full h-screen flex flex-col items-center justify-center" style={{background: 'linear-gradient(to bottom, #F27067, #D91D52)'}}>
            <div
                ref={captureRef}
                className="relative w-full h-screen"
                style={{background: 'linear-gradient(to bottom, #F27067, #D91D52)'}}
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
            {/* 다운로드 버튼 */}
            <button
                onClick={handleDownload}
                className="mt-6 px-4 py-2 bg-white text-gray-800 rounded-lg shadow"
            >
                이미지 저장
            </button>
            {/* 홈으로 */}
            <button
                onClick={() => router.push("/")}
                className="mt-2 px-4 py-2 bg-gray-700 text-white rounded-lg"
            >
                홈으로
            </button>
        </div>
    );
}
