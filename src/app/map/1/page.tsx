'use client';

import {useRef, useState} from "react";
import {useRouter} from "next/navigation";

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
    const [showDescription, setShowDescription] = useState<boolean>(true);
    const [showZoomHint, setShowZoomHint] = useState<boolean>(false);
    const router = useRouter();
    const imgRef = useRef<HTMLImageElement | null>(null);

    // 지도 전체 클릭
    const handleMapClick = () => {
        if (showDescription) {
            setShowDescription(false);
            setShowZoomHint(true);
            return;
        }
        if (showZoomHint) {
            setShowZoomHint(false);
            return;
        }
        setSelectedModal("fail");
    };

    const handleAreaClick = (e: React.MouseEvent, area: Area) => {
        e.stopPropagation();
        if (showDescription) {
            setShowDescription(false);
            setShowZoomHint(true);
            return;
        }
        if (showZoomHint) {
            setShowZoomHint(false);
            return;
        }
        setSelectedModal("success");
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

                {/* 최초 진입 설명 오버레이 */}
                {showDescription && (
                    <div className="absolute inset-0 z-40 flex items-start justify-center mt-47">
                        <img
                            src="/map_description.png"
                            alt="지도 이용 안내"
                            className="w-[80%] max-w-[700px] h-auto drop-shadow-xl"
                        />
                    </div>
                )}

                {/* 두 번째 안내: 좌상단 텍스트 힌트 */}
                {showZoomHint && !showDescription && (
                    <div className="absolute z-30 top-30 left-4">
                        <div className="bg-white/90 rounded-xl px-4 py-3 whitespace-pre-line text-black font-extrabold text-3xl leading-relaxed">
                            {`지도를\n확대하여\n찾아\n보세요`}
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
