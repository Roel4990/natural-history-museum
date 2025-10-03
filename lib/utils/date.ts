export function formatTodayISO(): string {
    const now = new Date();

    const kst = new Date(now.getTime());

    const yyyy = kst.getFullYear();
    const mm = String(kst.getMonth() + 1).padStart(2, '0');
    const dd = String(kst.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
}
