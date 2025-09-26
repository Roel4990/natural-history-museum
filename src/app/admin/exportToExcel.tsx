'use client';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {StatsResponse, Zone} from "@/app/type";

export function exportToExcel(data: StatsResponse) {
    if (!data) return;

    const workbook = XLSX.utils.book_new();

    const summary = [
        ['날짜', data.date],
        ['총 방문 수 (전체)', data.visits.ALL],
        ['자연사관 방문 수', data.visits.A],
        ['첨단기술관 방문 수', data.visits.B],
        ['과학탐구관 방문 수', data.visits.C],
        ['한국과학문명관 방문 수', data.visits.D],
        ['쿠폰 발행 수', data.coupons.issueCount],
        ['쿠폰 잔여 수', data.coupons.remaining]
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summary);
    XLSX.utils.book_append_sheet(workbook, summarySheet, '요약');

    // 2. 시간대별 방문자 시트 (구역별로 생성)
    const zones: Zone[] = ['ALL', 'A', 'B', 'C', 'D'];
    const zoneNameMapping: Record<Zone, string> = {
        ALL: '전체',
        A: '자연사관',
        B: '첨단기술관',
        C: '과학탐구관',
        D: '한국과학문명관',
    };
    zones.forEach(zone => {
        const hourlyData = data.hourly[zone] || [];
        const sheetData = [
            ['시간대', '방문자 수'],
            ...hourlyData.map(({ hour, visits }) => {
                const start = String(hour).padStart(2, '0');
                const end = String(hour + 1).padStart(2, '0');
                return [`${start}:00 ~ ${end}:00`, visits];
            }),
        ];
        const hourlySheet = XLSX.utils.aoa_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(workbook, hourlySheet, `시간대별 방문자 (${zoneNameMapping[zone]})`);
    });


    // 4. 파일 생성 및 다운로드
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileName = `방문통계_${data.date}.xlsx`;
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, fileName);
}
