export async function postVisitMetricVerbose(): Promise<boolean> {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
    const url = `${base}/api/v1/metrics/visit`;
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            keepalive: true,
        });
        return res.ok;
    } catch {
        return false;
    }
}
