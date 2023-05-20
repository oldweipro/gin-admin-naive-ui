import { http } from '@/utils/http/axios';

export interface BasicResponseModel<T = any> {
  code: number;
  msg: string;
  data: T;
}

export interface BasicPageParams {
  pageNumber: number;
  pageSize: number;
  total: number;
}

/**
 * @description: 获取用户信息
 */
export function getUserInfo() {
  return http.request<BasicResponseModel>(
    {
      url: '/user/getUserInfo',
      method: 'get',
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 用户登录
 */
export function login(params) {
  return http.request<BasicResponseModel>(
    {
      url: '/base/login',
      method: 'POST',
      params,
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 发送短信验证码
 */
export function sendSmsCode(params) {
  return http.request<BasicResponseModel>(
    {
      url: '/base/smsCode',
      method: 'POST',
      params,
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 用户使用验证码注册
 */
export function registerWithSmsCode(params) {
  return http.request<BasicResponseModel>(
    {
      url: '/base/registerWithSmsCode',
      method: 'POST',
      params,
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 获取图形验证码
 */
export function getCaptcha(params) {
  return http.request<BasicResponseModel>(
    {
      url: '/base/captcha',
      method: 'POST',
      params,
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 用户修改密码
 */
export function changePassword(params, uid) {
  return http.request(
    {
      url: `/user/u${uid}/changepw`,
      method: 'POST',
      params,
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 用户登出
 */
export function logout(params) {
  return http.request({
    url: '/login/logout',
    method: 'POST',
    params,
  });
}
