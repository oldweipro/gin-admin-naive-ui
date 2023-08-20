import { http } from '@/utils/http/axios';
import { GinResponse } from '@/model/ginResponse';
import { RedeemRequest, RedeemResponse, RedeemSearch } from '@/model/redeem';

/**
 * @description: 获取兑换码列表
 */
export function getRedeemCodeList(params: RedeemSearch) {
  return http.request<GinResponse<any>>(
    {
      url: '/redeem/getRedeemCodeList',
      method: 'GET',
      params,
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 生成兑换码
 */
export function generateRedeemCode(data: RedeemRequest) {
  return http.request<GinResponse<RedeemResponse>>(
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
