'use client';

import {useRef, useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {Area} from "@/app/type";

const areas: Area[] = [
    { id: 1, topPercent: 85, leftPercent: 60, widthPercent: 20, heightPercent: 10 }
];

export default function MapPage() {
    const [selectedModal, setSelectedModal] = useState<"success" | "fail" | null>(null);
    const [showDescription, setShowDescription] = useState<boolean>(true);
    const router = useRouter();
    const imgRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowDescription(false);
        }, 4000);

        return () => clearTimeout(timer);
    }, []);

    // 지도 전체 클릭
    const handleMapClick = () => {
        if (showDescription) {
            return;
        }
        setSelectedModal("fail");
    };

    const handleAreaClick = (e: React.MouseEvent, area: Area) => {
        e.stopPropagation();
        if (showDescription) {
            return;
        }
        setSelectedModal("success");
    };

    const handleModalClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedModal(null);
        if(selectedModal === "success") router.push("/quiz?quizNum=1")
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
                className="relative w-full max-w-[480px]"
                onClick={handleMapClick}
            >
                <img
                    ref={imgRef as React.RefObject<HTMLImageElement>}
                    src="/map_1/map_1.jpg"
                    alt="map"
                    className="w-full h-auto"
                />

                {/* 최초 진입 설명 오버레이 */}
                {showDescription && (
                    <div className="fixed inset-0 z-40 bg-black/60 flex items-center justify-center p-4">
                        <div className="relative w-full max-w-[480px] flex flex-col items-center gap-4">
                            <img
                                src="/map_1/map_1_description.png"
                                alt="지도 이용 안내"
                                className="w-[90%] max-w-[700px] h-auto drop-shadow-xl"
                            />
                            <img
                                src="/map_1/map_1_pic.jpg"
                                alt="지도 안내 이미지"
                                className="w-[85%] max-w-[700px] h-auto drop-shadow-xl"
                            />
                        </div>
                    </div>
                )}

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
