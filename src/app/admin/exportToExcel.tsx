'use client';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {StatsResponse} from "@/app/type";

export function exportToExcel(data: StatsResponse) {
    if (!data) return;

    // 1. 요약 시트 데이터
    const summary = [
        ['날짜', data.date],
        ['총 방문 수', data.visits],
        ['쿠폰 발행 수', data.coupons.issueCount],
        ['쿠폰 잔여 수', data.coupons.remaining],
        ['쿠폰 소진 여부', data.coupons.soldOut ? '소진됨' : '남아있음'],
    ];

    // 2. 시간대별 방문자 시트 데이터
    const hourly = [
        ['시간대', '방문자 수'],
        ...data.hourly.map(({ hour, visits }) => {
            const start = String(hour).padStart(2, '0');
            const end = String(hour + 1).padStart(2, '0');
            return [`${start}:00 ~ ${end}:00`, visits];
        }),
    ];

    // 3. 워크북 생성
    const workbook = XLSX.utils.book_new();
    const summarySheet = XLSX.utils.aoa_to_sheet(summary);
    const hourlySheet = XLSX.utils.aoa_to_sheet(hourly);

    XLSX.utils.book_append_sheet(workbook, summarySheet, '요약');
    XLSX.utils.book_append_sheet(workbook, hourlySheet, '시간대별 방문자 수');

    // 4. 파일 생성 및 다운로드
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileName = `방문통계_${data.date}.xlsx`;
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, fileName);
}
