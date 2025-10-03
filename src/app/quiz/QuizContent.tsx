import {useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {useIssueCoupon} from "@/hooks/useIssueCoupon";
import Image from "next/image";
import {isEventDay} from "../../../lib/utils/isEventDay";

export default function QuizContent() {
    const [selectedModal, setSelectedModal] = useState<"success" | "fail" | null>(null);
    const [isGeneratingCode, setIsGeneratingCode] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { mutate: issueCoupon } = useIssueCoupon();

    // 유효한 퀴즈 번호 범위 설정
    const rawQuizNum = Number(searchParams.get("quizNum"));
    const quizNum = (!rawQuizNum || rawQuizNum < 1) ? 1 : rawQuizNum > 4 ? 4 : rawQuizNum;
    const isTodayEventDay = isEventDay();
    const now = new Date();
    // 쿠폰 발급 처리 함수
    const handleCouponIssue = (isSuccess: "success" | "fail") => {
        setIsGeneratingCode(true);
        // 경품 추천일인지 체크
        if (!isTodayEventDay) {
            alert("정답입니다! 아쉽지만 오늘은 경품 추천일이 아니에요.");
            setIsGeneratingCode(false);
            return router.push(`/?sortNum=${rawQuizNum}`);
        }

        const currentHour = now.getHours();
        console.log("currentHour: ", currentHour)
        if (currentHour < 11 || currentHour >= 15) {
            alert("정답입니다! 아쉽지만 현재 경품 추천 시간이 아니에요.");
            setIsGeneratingCode(false);
            return router.push(`/?sortNum=${rawQuizNum}`);
        }

        const existingCode = localStorage.getItem('prizeCode');
        if (existingCode) {
            const codeDateStr = existingCode.substring(0, 5); // "MM.DD" 추출

            const today = new Date();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const todayDateStr = `${mm}.${dd}`;

            if (codeDateStr === todayDateStr) {
                // 날짜가 오늘과 일치하면 기존 코드를 사용
                setIsGeneratingCode(false);
                return setSelectedModal(isSuccess);
            }
        }

        // 기존 코드가 없거나 날짜가 다르면 새로 발급
        issueCoupon(undefined, {
            onSuccess: (res) => {
                if (res?.success && res.data) {
                    const { date, issued, soldOut } = res.data;
                    console.log(date, issued, soldOut);
                    if (soldOut) {
                        alert("정답입니다! 아쉽게도 오늘 준비된 쿠폰은 모두 소진되었어요.");
                        return router.push('/');
                    }

                    const [, mmRaw, ddRaw] = (date || '').split('-');
                    const mm = (mmRaw || '').padStart(2, '0');
                    const dd = (ddRaw || '').padStart(2, '0');
                    const seq = String(issued ?? 0).padStart(3, '0');
                    const code = `${mm}.${dd}.${seq}`;

                    console.log(code);
                    localStorage.setItem('prizeCode', code);
                    localStorage.setItem('couponMeta', JSON.stringify(res.data));

                    setSelectedModal(isSuccess);
                } else {
                    alert("쿠폰 발급에 실패하였습니다. 잠시 후 다시 시도해주세요.");
                }
            },
            onError: () => {
                alert("쿠폰 발급에 실패하였습니다. 잠시 후 다시 시도해주세요.");
            },
            onSettled: () => {
                setIsGeneratingCode(false);
            }
        });
    };

    const handleAnswerSelect = (answerNumber: number) => {
        let isSuccess: "success" | "fail" = "fail";

        if (
            (quizNum === 1 && answerNumber === 3) ||
            (quizNum === 2 && answerNumber === 4) ||
            (quizNum === 3 && answerNumber === 2) ||
            (quizNum === 4 && answerNumber === 1)
        ) {
            isSuccess = "success";
        }

        if (isSuccess === "success") {
            handleCouponIssue(isSuccess);
        } else {
            setSelectedModal("fail");
        }
    };


    const handleModalClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedModal(null);

        if(selectedModal === "success") {
            router.push('/prize');
        }
    };
    const modalImageSrc =
        selectedModal === "success"
            ? "/quiz_success_modal.png"
            : selectedModal === "fail"
                ? "/quiz_fail_modal.png"
                : "";
    return (
        <div className="min-h-screen bg-white py-8">
            <div className="max-w-3xl mx-auto px-4">
                {/* 문제 이미지 */}
                <div className="mb-8">
                    <Image
                        src={`/quiz_${quizNum}/quiz_${quizNum}_question.png`}
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
                                src={`/quiz_${quizNum}/quiz_${quizNum}_answer_${answerNumber}.png`}
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