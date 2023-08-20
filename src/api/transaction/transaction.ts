import { http } from '@/utils/http/axios';
import { RedeemFishCoinRequest } from '@/model/redeem_fish_coin';
import { GinResponse } from '@/model/ginResponse';

/**
 * @description: 获取当前用户钱包
 */
export function getCurrentUserWallets() {
  return http.request(
    {
      url: '/wallets/getCurrentUserWallets',
      method: 'GET',
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 验证兑换码
 */
export function handleValidateChatTicket(data) {
  return http.request(
    {
      url: '/chatTicket/handleValidateChatTicket',
      method: 'PUT',
      data,
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 兑换鱼币
 */
export function redeemFishCoin(data: RedeemFishCoinRequest) {
  return http.request<GinResponse<any>>(
    {
      url: '/redeem/redeemFishCoin',
      method: 'POST',
      data,
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 验证兑换码
 */
export function checkInApi() {
  return http.request(
    {
      url: '/chatTicket/checkIn',
      method: 'POST',
    },
    {
      isTransformResponse: false,
    }
  );
}
