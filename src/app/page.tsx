'use client';

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

type Area = {
    id: number;
    topPercent: number;
    leftPercent: number;
    widthPercent: number;
    heightPercent: number;
    quizUrl: string;
};

// 예시: 원본 이미지 사이즈를 기준으로 %로 계산된 영역들
const areas: Area[] = [
    { id: 1, topPercent: 10, leftPercent: 10, widthPercent: 20, heightPercent: 10, quizUrl: "/quiz/1" },
    { id: 2, topPercent: 50, leftPercent: 50, widthPercent: 20, heightPercent: 10, quizUrl: "/quiz/2" },
];

export default function Page() {
    const [selected, setSelected] = useState<Area | null>(null);
    const router = useRouter();
    const imgRef = useRef<HTMLImageElement | null>(null);
    const [imgSize, setImgSize] = useState<{ width: number; height: number } | null>(null);

    // 이미지 실제 렌더링된 크기 측정
    useEffect(() => {
        const updateSize = () => {
            if (imgRef.current) {
                setImgSize({
                    width: imgRef.current.clientWidth,
                    height: imgRef.current.clientHeight,
                });
            }
        };
        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    // 🔹 픽셀 좌표 → % 좌표 변환 함수
    const toPercent = (pxTop: number, pxLeft: number, pxWidth: number, pxHeight: number) => {
        if (!imgSize) return null;
        return {
            topPercent: (pxTop / imgSize.height) * 100,
            leftPercent: (pxLeft / imgSize.width) * 100,
            widthPercent: (pxWidth / imgSize.width) * 100,
            heightPercent: (pxHeight / imgSize.height) * 100,
        };
    };

    return (
        <div className="relative w-full max-w-[800px] mx-auto">
            {/* 배경 이미지 */}
            <img
                ref={imgRef}
                src="/natural_history_hall_map.jpg"
                alt="map"
                className="w-full h-auto"
            />

            {/* 클릭 가능한 영역 */}
            {areas.map((area) => (
                <div
                    key={area.id}
                    className="absolute border-2 border-blue-500 cursor-pointer bg-blue-500/20 hover:bg-blue-500/30"
                    style={{
                        top: `${area.topPercent}%`,
                        left: `${area.leftPercent}%`,
                        width: `${area.widthPercent}%`,
                        height: `${area.heightPercent}%`,
                    }}
                    onClick={() => setSelected(area)}
                />
            ))}

            {/* 말풍선 모달 */}
            {selected && (
                <div
                    className="absolute bg-white border rounded-xl shadow-lg p-3 text-sm w-48"
                    style={{
                        top: `${selected.topPercent}%`,
                        left: `${selected.leftPercent + selected.widthPercent + 2}%`, // 영역 옆에 붙이기
                    }}
                >
                    <div className="relative">
                        {/* 화살표 */}
                        <div className="absolute -left-2 top-4 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white"></div>

                        <p className="mb-3 text-gray-700">
                            이 지역 문제를 풀러 가시겠습니까?
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-2 py-1 rounded bg-gray-500 text-white"
                                onClick={() => setSelected(null)}
                            >
                                취소
                            </button>
                            <button
                                className="px-2 py-1 rounded bg-blue-600 text-white"
                                onClick={() => selected && router.push(selected.quizUrl)}
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
