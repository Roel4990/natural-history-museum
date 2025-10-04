export function isBeforeEleven(): boolean {
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour < 11;
}

export function isAfterThree(): boolean {
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour >= 15;
}