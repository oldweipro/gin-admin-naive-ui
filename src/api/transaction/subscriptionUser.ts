import { http } from '@/utils/http/axios';
import { GinResponse } from '@/model/ginResponse';
import { SubscribeRequest } from '@/model/subscriptionPlan';

/**
 * @description: 订阅
 */
export function subscribePlan(data: SubscribeRequest) {
  return http.request<GinResponse<any>>(
    {
      url: '/subscriptionPlan/subscribePlan',
      method: 'POST',
      data,
    },
    {
      isTransformResponse: false,
    }
  );
}
