import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {createSupabaseServerClient} from "../../../../lib/supabaseServer";


// ⚠️ 이 파일은 서버에서만 실행되므로 service_role key가 노출되지 않습니다.
//    Vercel에 환경변수로 넣어두세요.

// POST 바디 검증: userId 삭제, product만 필요
const BodySchema = z.object({
    product: z.enum(['A', 'B', 'C']),
});

export async function POST(req: NextRequest) {
    try {
        const json = await req.json();
        const { product } = BodySchema.parse(json);

        const supabase = createSupabaseServerClient();

        // Postgres 함수 호출: 계정 없이 재고만 차감하는 버전
        // claim_product(p_product text) RETURNS int
        const { data, error } = await supabase.rpc('claim_product', {
            p_product: product,
        });

        if (error) {
            // 함수에서 raise exception 'SOLD_OUT'을 던지면 여기로 들어옴
            if (error.message?.includes('SOLD_OUT')) {
                return NextResponse.json({ ok: false, reason: 'SOLD_OUT' }, { status: 409 });
            }
            console.error('RPC error:', error);
            return NextResponse.json({ ok: false, reason: 'SERVER_ERROR' }, { status: 500 });
        }

        // data = 남은 수량(int)
        return NextResponse.json({ ok: true, remaining: data }, { status: 200 });
    } catch (e: unknown) {
        console.error(e);
        return NextResponse.json({ ok: false, reason: 'BAD_REQUEST' }, { status: 400 });
    }
}

// (선택) 남은 수량 조회: /api/claim?product=A 또는 전체
export async function GET(req: NextRequest) {
    try {
        const supabase = createSupabaseServerClient();
        const { searchParams } = new URL(req.url);
        const product = searchParams.get('product');

        if (product) {
            const { data, error } = await supabase
                .from('inventory')
                .select('product, remaining')
                .eq('product', product)
                .single();

            if (error) throw error;
            return NextResponse.json({ ok: true, item: data }, { status: 200 });
        }

        // 전체 재고
        const { data, error } = await supabase
            .from('inventory')
            .select('product, remaining')
            .order('product');

        if (error) throw error;
        return NextResponse.json({ ok: true, items: data }, { status: 200 });
    } catch (e: unknown) {
        console.error(e);
        return NextResponse.json({ ok: false, reason: 'SERVER_ERROR' }, { status: 500 });
    }
}
