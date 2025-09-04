'use client';

import { useState } from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";

export default function Quiz1Page() {
    const [selectedModal, setSelectedModal] = useState<"success" | "fail" | null>(null);
    const router = useRouter();
    const handleAnswerSelect = (answerNumber: number) => {
        setSelectedModal(answerNumber === 3 ? "success" : "fail" )
    };
    const handleModalClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedModal(null);
        router.push("/prize")
    };
    const modalImageSrc =
        selectedModal === "success"
            ? "/map_success_modal.png"
            : selectedModal === "fail"
                ? "/map_fail_modal.png"
                : "";
    return (
        <div className="min-h-screen bg-white py-8">
            <div className="max-w-3xl mx-auto px-4">
                {/* 문제 이미지 */}
                <div className="mb-8">
                    <Image
                        src="/quiz_1_question.png"
                        alt="Quiz Question"
                        width={800}
                        height={400}
                        className="w-full h-auto rounded-lg"
                    />
                </div>

                {/* 답안 이미지들 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((answerNumber) => (
                        <div
                            key={answerNumber}
                            className={`cursor-pointer p-2 rounded-lg`}
                            onClick={() => handleAnswerSelect(answerNumber)}
                        >
                            <Image
                                src={`/quiz_1_answer_${answerNumber}.png`}
                                alt={`Answer ${answerNumber}`}
                                width={400}
                                height={300}
                                className="w-full h-auto rounded-lg"
                            />
                        </div>
                    ))}
                </div>

                {/* 뒤로가기 버튼 */}
                <div className="mt-8 text-center">
                    <button
                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg"
                        onClick={() => window.history.back()}
                    >
                        지도로 돌아가기
                    </button>
                </div>

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
        </div>
    );
}
