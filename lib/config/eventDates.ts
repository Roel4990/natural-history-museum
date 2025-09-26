// lib/config/eventDates.ts

/**
 * 경품 추천 이벤트 날짜 설정
 */
interface EventDateConfig {
  /**
   * 주말(토, 일)에 항상 이벤트를 활성화할지 여부
   */
  enableOnWeekends: boolean;

  /**
   * 예외적으로 이벤트를 항상 활성화할 날짜 목록 (YYYY-MM-DD 형식)
   * (예: 평일이지만 이벤트 진행이 필요한 날)
   */
  alwaysEnableOnDates: string[];

  /**
   * 예외적으로 이벤트를 항상 비활성화할 날짜 목록 (YYYY-MM-DD 형식)
   * (예: 주말이지만 이벤트 진행이 필요 없는 날)
   */
  alwaysDisableOnDates: string[];
}

export const eventDateConfig: EventDateConfig = {
    enableOnWeekends: true,
    alwaysEnableOnDates: [
        '2025-10-03',
        '2025-10-10',
        '2025-12-25'
    ],
    alwaysDisableOnDates: [],
};
