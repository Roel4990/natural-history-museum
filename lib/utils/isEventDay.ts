// lib/utils/isEventDay.ts
import { eventDateConfig } from '../config/eventDates';

/**
 * 주어진 날짜가 경품 추천 이벤트 진행일인지 확인합니다.
 * @param date 확인할 날짜 (기본값: 오늘)
 * @returns 이벤트 진행일이면 true, 아니면 false
 */
export function isEventDay(date: Date = new Date()): boolean {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  // 1. 항상 비활성화 목록 확인
  if (eventDateConfig.alwaysDisableOnDates.includes(todayStr)) {
    return false;
  }

  // 2. 항상 활성화 목록 확인
  if (eventDateConfig.alwaysEnableOnDates.includes(todayStr)) {
    return true;
  }

  // 3. 주말 활성화 설정 확인
  if (eventDateConfig.enableOnWeekends) {
    const dayOfWeek = date.getDay(); // 0: Sunday, 6: Saturday
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return true;
    }
  }

  // 4. 위 조건에 모두 해당하지 않으면 비활성화
  return false;
}
