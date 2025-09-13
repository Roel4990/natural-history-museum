'use client';

import {useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {Area} from "@/app/type";

const areas: Area[] = [
    { id: 1, topPercent: 73, leftPercent: 65, widthPercent: 20, heightPercent: 10 }
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
        if(selectedModal === "success") router.push("/quiz?quizNum=3")
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
                    src="/map_3/map_3.jpg"
                    alt="map"
                    className="w-full h-auto"
                />

                {/* 최초 진입 설명 오버레이 */}
                {showDescription && (
                    <div className="absolute inset-0 z-40 flex items-start justify-center mt-47">
                        <img
                            src="/map_3/map_3_description.png"
                            alt="지도 이용 안내"
                            className="w-[80%] max-w-[700px] h-auto drop-shadow-xl"
                        />
                    </div>
                )}

                {/* 두 번째 안내: 좌상단 텍스트 힌트 */}
                {showZoomHint && !showDescription && (
                    <div
                        className="absolute z-30"
                        style={{
                            top: "9.7%",
                            right: "9%",
                        }}
                    >
                        <div
                            className="rounded-xl px-4 py-3 whitespace-pre-line text-black font-extrabold leading-relaxed text-base">
                            지도를 움직여서 숨겨진 위치를 찾아보세요!
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
                        className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 animate-fade-in "
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
