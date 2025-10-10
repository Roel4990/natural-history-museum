export type Area = {
    id: number;
    topPercent: number;
    leftPercent: number;
    widthPercent: number;
    heightPercent: number;
};


export type Zone = 'ALL' | 'A' | 'B' | 'C' | 'D' | 'E';

export type StatsResponse = {
    date: string;
    visits: Record<Zone, number>;
    hourly: Record<Zone, {
        hour: number;
        visits: number;
    }[]>;
    coupons: {
        issueCount: number;
        remaining: number;
        soldOut: boolean;
    };
};