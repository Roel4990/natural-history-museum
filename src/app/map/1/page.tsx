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

const areas: Area[] = [
    { id: 1, topPercent: 85, leftPercent: 60, widthPercent: 20, heightPercent: 10, quizUrl: "/quiz/1" }
];

export default function MapPage() {
    const [selectedModal, setSelectedModal] = useState<"success" | "fail" | null>(null);
    const router = useRouter();
    const imgRef = useRef<HTMLImageElement | null>(null);

    // 지도 전체 클릭
    const handleMapClick = () => {
        // 기본적으로 실패 모달
        setSelectedModal("fail");
    };

    const handleAreaClick = (e: React.MouseEvent, area: Area) => {
        e.stopPropagation();
        setSelectedModal("success");
        // 필요하면 여기서 router.push(area.quizUrl) 등도 가능
    };

    const handleModalClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedModal(null);
        if(selectedModal === "success") router.push("/quiz/1")
    };

    const modalImageSrc =
        selectedModal === "success"
            ? "/map_success_modal.png"
            : selectedModal === "fail"
                ? "/map_fail_modal.png"
                : "";

    return (
        <main className="flex justify-center items-center min-h-screen bg-white">
            <div
                className="relative w-full max-w-[800px] bg-black"
                onClick={handleMapClick}
            >
                <img
                    ref={imgRef as React.RefObject<HTMLImageElement>}
                    src="/natural_history_hall_map.jpg"
                    alt="map"
                    className="w-full h-auto"
                />

                {areas.map((area) => (
                    <div
                        key={area.id}
                        className="absolute cursor-pointer"
                        style={{
                            top: `${area.topPercent}%`,
                            left: `${area.leftPercent}%`,
                            width: `${area.widthPercent}%`,
                            height: `${area.heightPercent}%`,
                        }}
                        onClick={(e) => handleAreaClick(e, area)}
                    />
                ))}

                {/* 중앙 모달 이미지 */}
                {selectedModal && (
                    <div
                        onClick={handleModalClick}
                        className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 animate-fade-in"
                    >
                        <img
                            src={modalImageSrc}
                            alt="결과 모달"
                            className="w-[250px] max-w-[80%] h-auto cursor-pointer drop-shadow-lg"
                        />
                    </div>
                )}
            </div>
        </main>
    );
}
