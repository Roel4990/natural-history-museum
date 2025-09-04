import { useMutation } from '@tanstack/react-query';
import { issueCouponRequest, type IssueCouponResponse } from '@/lib/api/coupons';
import type { ApiResult } from '@/lib/api/types';

export function useIssueCoupon() {
    return useMutation<ApiResult<IssueCouponResponse>>({
        mutationFn: issueCouponRequest,
    });
}
