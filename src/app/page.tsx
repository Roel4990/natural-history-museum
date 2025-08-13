'use client';

import { useEffect, useMemo, useState } from 'react';

type Product = 'A' | 'B' | 'C';
type StockMap = Record<Product, number>;

export default function Page() {
  const [stock, setStock] = useState<StockMap | null>(null);
  const [modalOpen, setModalOpen] = useState(true); // 모바일 모달 기본 오픈
  const [phase, setPhase] = useState<'idle' | 'spinning' | 'result'>('idle');
  const [result, setResult] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function fetchStock() {
    setErrorMsg(null);
    try {
      const res = await fetch('/api/claim', { method: 'GET' });
      const json = await res.json();
      if (!json.ok) {
        setErrorMsg(json.reason ?? '재고 조회 실패');
        return;
      }
      const map = Object.fromEntries(
          (json.items as Array<{ product: Product; remaining: number }>).map(i => [i.product, i.remaining])
      ) as StockMap;
      setStock(map);
    } catch (e: any) {
      setErrorMsg(e?.message ?? '네트워크 오류');
    }
  }

  useEffect(() => {
    fetchStock();
  }, []);

  const allSoldOut = useMemo(() => {
    if (!stock) return false;
    return (stock.A ?? 0) <= 0 && (stock.B ?? 0) <= 0 && (stock.C ?? 0) <= 0;
  }, [stock]);

  // 가볍게: 남은 재고 중 하나를 랜덤으로 뽑아서 POST /api/claim 호출
  async function drawOnce(): Promise<{ ok: boolean; product?: Product; remaining?: number; reason?: string }> {
    // 1) 남은 재고 조회
    const res = await fetch('/api/claim');
    const data = await res.json();
    if (!data.ok) return { ok: false, reason: data.reason ?? 'STOCK_FETCH_FAILED' };

    const items = (data.items as Array<{ product: Product; remaining: number }>) || [];
    const available = items.filter(i => i.remaining > 0).map(i => i.product);
    if (available.length === 0) return { ok: false, reason: 'SOLD_OUT' };

    // 2) 랜덤 선택
    const choice = available[Math.floor(Math.random() * available.length)];

    // 3) 차감 시도
    const res2 = await fetch('/api/claim', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ product: choice }),
    });
    const json2 = await res2.json();
    if (!json2.ok) {
      return { ok: false, reason: json2.reason ?? 'SERVER_ERROR' };
    }
    return { ok: true, product: choice, remaining: json2.remaining as number };
  }

  // 버튼 클릭 → 스피너 → 결과
  async function onDraw() {
    if (allSoldOut || phase === 'spinning') return;
    setPhase('spinning');
    setResult(null);
    setErrorMsg(null);

    // 연출용 딜레이(스피너가 "도는" 느낌)
    await new Promise(r => setTimeout(r, 900));

    const r = await drawOnce();

    if (!r.ok) {
      if (r.reason === 'SOLD_OUT') {
        setPhase('result');
        setResult('이미 마감되었어요 😢');
        await fetchStock(); // 서버 상태 동기화
        return;
      }
      setPhase('result');
      setResult(`실패: ${r.reason}`);
      return;
    }

    // 성공 처리
    setPhase('result');
    setResult(`${r.product} 당첨! 🎉 남은 수량: ${r.remaining}`);

    // 로컬 재고 갱신
    setStock(prev => (prev ? { ...prev, [r.product!]: r.remaining! } : prev));
  }

  return (
      <main style={{ minHeight: '100svh', background: '#f8fafc' }}>
        {/* 헤더 */}
        <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px 16px 0' }}>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>한정 당첨 데모 (모바일)</h1>
          <p style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>
            버튼을 누르면 랜덤으로 A/B/C 중 하나에 도전하고, 재고가 있으면 당첨됩니다.
          </p>
        </div>

        {/* 현재 재고 표시 */}
        <div style={{ maxWidth: 480, margin: '12px auto 0', padding: '0 16px' }}>
          <div
              style={{
                display: 'flex',
                gap: 8,
                fontSize: 14,
                color: '#334155',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: 12,
              }}
          >
            <span>남은 수량</span>
            <span>• A: {stock?.A ?? '-'}</span>
            <span>• B: {stock?.B ?? '-'}</span>
            <span>• C: {stock?.C ?? '-'}</span>
            <button
                onClick={fetchStock}
                style={{
                  marginLeft: 'auto',
                  fontSize: 12,
                  padding: '6px 10px',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  background: '#fff',
                }}
            >
              새로고침
            </button>
          </div>
          {errorMsg && (
              <div
                  style={{
                    marginTop: 8,
                    fontSize: 12,
                    color: '#b91c1c',
                    background: '#fef2f2',
                    border: '1px solid #fee2e2',
                    borderRadius: 10,
                    padding: 8,
                  }}
              >
                {errorMsg}
              </div>
          )}
        </div>

        {/* 모달 열기 버튼 (모바일 고정 하단) */}
        <div
            style={{
              position: 'fixed',
              left: 0,
              right: 0,
              bottom: 0,
              padding: 16,
              background:
                  'linear-gradient(to top, rgba(248,250,252,1) 60%, rgba(248,250,252,0))',
            }}
        >
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <button
                onClick={() => setModalOpen(true)}
                disabled={allSoldOut}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: 16,
                  fontWeight: 700,
                  borderRadius: 12,
                  border: 'none',
                  color: allSoldOut ? '#475569' : '#fff',
                  background: allSoldOut ? '#e2e8f0' : '#2563eb',
                }}
            >
              {allSoldOut ? '모두 마감됨' : '추첨하기'}
            </button>
          </div>
        </div>

        {/* 모달 */}
        {modalOpen && (
            <div
                onClick={() => (phase !== 'spinning' ? setModalOpen(false) : null)}
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(15, 23, 42, 0.45)',
                  display: 'grid',
                  placeItems: 'center',
                  padding: 16,
                  zIndex: 50,
                }}
            >
              <div
                  onClick={e => e.stopPropagation()}
                  style={{
                    width: '100%',
                    maxWidth: 420,
                    background: '#ffffff',
                    borderRadius: 16,
                    border: '1px solid #e2e8f0',
                    padding: 18,
                    textAlign: 'center',
                  }}
              >
                <div style={{ fontSize: 18, fontWeight: 700 }}>즉석 추첨</div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                  버튼을 누르면 스피너가 돌고, 재고가 있는 상품이면 당첨됩니다.
                </div>

                <div style={{ marginTop: 20, marginBottom: 14 }}>
                  {phase === 'spinning' ? (
                      <div
                          style={{
                            width: 72,
                            height: 72,
                            margin: '0 auto',
                            border: '6px solid #e2e8f0',
                            borderTopColor: '#2563eb',
                            borderRadius: '9999px',
                            animation: 'spin 0.8s linear infinite',
                          }}
                      />
                  ) : phase === 'result' ? (
                      <div
                          style={{
                            fontSize: 20,
                            fontWeight: 800,
                            color: '#111827',
                            minHeight: 60,
                            display: 'grid',
                            placeItems: 'center',
                          }}
                      >
                        {result}
                      </div>
                  ) : (
                      <div style={{ height: 60 }} />
                  )}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                      onClick={onDraw}
                      disabled={phase === 'spinning' || allSoldOut}
                      style={{
                        flex: 1,
                        padding: '14px 12px',
                        borderRadius: 12,
                        border: '1px solid #e2e8f0',
                        background: '#2563eb',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 16,
                      }}
                  >
                    {phase === 'spinning' ? '추첨 중…' : allSoldOut ? '마감됨' : '추첨하기'}
                  </button>
                  <button
                      onClick={() => {
                        if (phase !== 'spinning') {
                          setPhase('idle');
                          setResult(null);
                          setModalOpen(false);
                        }
                      }}
                      disabled={phase === 'spinning'}
                      style={{
                        width: 110,
                        padding: '14px 12px',
                        borderRadius: 12,
                        border: '1px solid #e2e8f0',
                        background: '#fff',
                        fontWeight: 700,
                        fontSize: 16,
                        color: '#111827',
                      }}
                  >
                    닫기
                  </button>
                </div>
              </div>

              {/* 스피너 키프레임 (인라인) */}
              <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
          `}</style>
            </div>
        )}
      </main>
  );
}
