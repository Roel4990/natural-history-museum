export type Area = {
    id: number;
    topPercent: number;
    leftPercent: number;
    widthPercent: number;
    heightPercent: number;
};


export type StatsResponse = {
    date: string;
    visits: number;
    hourly: {
        hour: number;
        visits: number;
    }[];
    coupons: {
        issueCount: number;
        remaining: number;
        soldOut: boolean;
    };
};