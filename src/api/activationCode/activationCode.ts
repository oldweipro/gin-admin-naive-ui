import { http } from '@/utils/http/axios';
import { GinResponse } from '@/model/ginResponse';

/**
 * @description: 获取订阅状态
 */
export function getActivationCodeStatus() {
  return http.request<GinResponse<any>>(
    {
      url: `/activationCode/getActivationCodeStatus`,
      method: 'GET',
    },
    {
      isTransformResponse: false,
    }
  );
}
/**
 * @description: 获取激活码
 */
export function getJetBrainsActivationCode() {
  return http.request<GinResponse<any>>(
    {
      url: `/activationCode/getJetBrainsActivationCode`,
      method: 'GET',
    },
    {
      isTransformResponse: false,
    }
  );
}
