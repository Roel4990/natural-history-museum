'use client';

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

export default function PrizePage() {
    const [prizeImageUrl, setPrizeImageUrl] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    
    useEffect(() => {
        const generatePrizeImage = async () => {
            try {
                // localStorage에서 상품 코드 가져오기
                const prizeCode = localStorage.getItem('prizeCode') || "09.06.001";
                
                // Canvas 생성
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                
                canvas.width = 400;
                canvas.height = 800;
                
                // 배경 그라데이션 생성
                const gradient = ctx.createLinearGradient(0, 0, 0, 800);
                gradient.addColorStop(0, '#F27067');
                gradient.addColorStop(1, '#D91D52');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, 400, 800);
                
                // 배경 이미지 로드 및 그리기
                const backgroundImage = new Image();
                backgroundImage.crossOrigin = 'anonymous';
                backgroundImage.onload = () => {
                    ctx.drawImage(backgroundImage, 0, 0, 400, 800);
                    
                    // 텍스트 스타일 설정
                    ctx.fillStyle = '#FCD34D'; // yellow-300 색상
                    ctx.textAlign = 'center';
                    
                    // "경품교환권" 텍스트
                    ctx.font = 'bold 48px Arial';
                    ctx.fillText('경품교환권', 200, 100);
                    
                    // 상품 코드 텍스트
                    ctx.font = 'bold 42px Arial';
                    ctx.fillText(prizeCode, 200, 180);
                    
                    // 이미지 URL 생성
                    const imageUrl = canvas.toDataURL('image/png');
                    setPrizeImageUrl(imageUrl);
                    setIsLoading(false);
                };
                
                backgroundImage.onerror = () => {
                    // 이미지 로드 실패 시 텍스트만 그리기
                    ctx.fillStyle = '#FCD34D';
                    ctx.textAlign = 'center';
                    ctx.font = 'bold 48px Arial';
                    ctx.fillText('경품교환권', 200, 100);
                    ctx.font = 'bold 42px Arial';
                    ctx.fillText(prizeCode, 200, 180);
                    
                    const imageUrl = canvas.toDataURL('image/png');
                    setPrizeImageUrl(imageUrl);
                    setIsLoading(false);
                };
                
                backgroundImage.src = '/prize_recommendation.png';
                
            } catch (error) {
                console.error('이미지 생성 중 오류:', error);
                setIsLoading(false);
            }
        };
        
        generatePrizeImage();
    }, []);
    
    const handleDownload = () => {
        if (prizeImageUrl) {
            const link = document.createElement("a");
            link.href = prizeImageUrl;
            link.download = "prize.png";
            link.click();
        }
    };
    return (
        <div className="min-h-screen flex flex-col items-center justify-center py-8" style={{background: 'linear-gradient(to bottom, #F27067, #D91D52)'}}>
            {isLoading ? (
                <div className="text-white text-2xl">이미지 생성 중...</div>
            ) : (
                <div className="flex flex-col items-center gap-6">
                    {/* 생성된 이미지 표시 */}
                    <img
                        src={prizeImageUrl}
                        alt="Generated Prize"
                        className="w-[400px] h-auto rounded-lg shadow-lg"
                    />
                    
                    {/* 버튼들 */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleDownload}
                            className="px-6 py-3 bg-white text-gray-800 rounded-lg shadow-lg hover:bg-gray-100 transition-colors font-semibold"
                        >
                            이미지 저장
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
