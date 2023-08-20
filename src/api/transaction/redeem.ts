import { http } from '@/utils/http/axios';
import { GinResponse } from '@/model/ginResponse';
import { RedeemRequest } from '@/model/redeem';

/**
 * @description: 创建订阅计划
 */
export function generateRedeemCode(data: RedeemRequest) {
  return http.request<GinResponse<any>>(
    {
      url: '/redeem/generateRedeemCode',
      method: 'POST',
      data,
    },
    {
      isTransformResponse: false,
    }
  );
}
