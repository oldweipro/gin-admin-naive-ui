import { http } from '@/utils/http/axios';
import { GinResponse } from '@/model/ginResponse';
import { LoginQrcodeGenerate, LoginQrcodePoll } from '@/model/memoNexus';

/**
 * @description: 获取登陆二维码
 */
export function getLoginQrcodeGenerate() {
  return http.request<GinResponse<LoginQrcodeGenerate>>(
    {
      url: '/memoNexus/getLoginQrcodeGenerate',
      method: 'GET',
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 等待登陆返回
 */
export function loginQrcodePoll(data: LoginQrcodePoll) {
  return http.request<GinResponse<any>>(
    {
      url: '/memoNexus/loginQrcodePoll',
      method: 'POST',
      data,
      timeout: 1000 * 60 * 3,
    },
    {
      isTransformResponse: false,
    }
  );
}
