'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

type Area = {
  id: number;
  top: number;
  left: number;
  width: number;
  height: number;
  quizUrl: string;
};

const areas: Area[] = [
  { id: 1, top: 100, left: 100, width: 200, height: 200, quizUrl: "/quiz/1" },
  { id: 2, top: 400, left: 400, width: 200, height: 200, quizUrl: "/quiz/2" },
];

export default function Page() {
  const [selected, setSelected] = useState<Area | null>(null);
  const router = useRouter();

  return (
      <div className="relative w-[800px] mx-auto">
        {/* 배경 이미지 */}
        <img
            src="/natural_history_hall_map.jpg"
            alt="map"
            className="w-full"
        />

        {/* 클릭 가능한 영역 */}
        {areas.map((area) => (
            <div
                key={area.id}
                className="absolute border-2 border-blue-500 cursor-pointer bg-blue-500/20 hover:bg-blue-500/30"
                style={{
                  top: area.top,
                  left: area.left,
                  width: area.width,
                  height: area.height,
                }}
                onClick={() => setSelected(area)}
            />
        ))}

        {/* 말풍선 모달 */}
        {selected && (
            <div
                className="absolute bg-white border rounded-xl shadow-lg p-3 text-sm w-48"
                style={{
                  top: selected.top,
                  left: selected.left + selected.width + 10, // 영역 오른쪽에 붙이기
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
                      className="px-2 py-1 rounded bg-gray-500"
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
