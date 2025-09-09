'use client';

import {useState} from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";
import { useIssueCoupon } from "@/hooks/useIssueCoupon";

export default function Quiz1Page() {
    const [selectedModal, setSelectedModal] = useState<"success" | "fail" | null>(null);
    const [isGeneratingCode, setIsGeneratingCode] = useState(false);
    const router = useRouter();
    const { mutate: issueCoupon } = useIssueCoupon();
    
    const handleAnswerSelect = (answerNumber: number) => {
        setSelectedModal(answerNumber === 3 ? "success" : "fail" )
    };
    
    const handleModalClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedModal(null);
        
        if(selectedModal === "success") {
            setIsGeneratingCode(true);

            // 쿠폰 발급 API 호출 (성공 시 응답 저장 후 이동)
            issueCoupon(undefined, {
                onSuccess: (res) => {
                    if (res?.success && res.data) {
                        const { date, issued } = res.data;
                        const [, mmRaw, ddRaw] = (date || '').split('-');
                        const mm = (mmRaw || '').padStart(2, '0');
                        const dd = (ddRaw || '').padStart(2, '0');
                        const seq = String(issued ?? 0).padStart(3, '0');
                        const code = `${mm}.${dd}.${seq}`;
                        console.log(code)
                        try {
                            localStorage.setItem('prizeCode', code);
                            localStorage.setItem('couponMeta', JSON.stringify(res.data));
                        } catch {}
                        router.push('/prize');
                    } else {
                        alert("쿠폰 발급 실패");
                    }
                },
                onError: () => {
                    alert("쿠폰 발급에 실패하였습니다. 잠시 후 다시 시도해주세요.");
                },
                onSettled: () => {
                    setIsGeneratingCode(false);
                }
            });
        }
    };
    const modalImageSrc =
        selectedModal === "success"
            ? "/quiz_1_success_modal.png"
            : selectedModal === "fail"
                ? "/quiz_1_fail_modal.png"
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

                {/* 중앙 모달 이미지 */}
                {selectedModal && (
                    <div
                        onClick={handleModalClick}
                        className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 animate-fade-in"
                    >
                        {isGeneratingCode ? (
                            <div className="bg-white rounded-lg p-6 text-center">
                                <div className="text-lg font-semibold mb-2">상품 코드 생성 중...</div>
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            </div>
                        ) : (
                            <img
                                src={modalImageSrc}
                                alt="결과 모달"
                                className="w-[250px] max-w-[80%] h-auto cursor-pointer drop-shadow-lg"
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
