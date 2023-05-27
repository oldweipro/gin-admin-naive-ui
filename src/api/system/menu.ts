import { http } from '@/utils/http/axios';

/**
 * @description: 根据用户id获取用户菜单
 */
export function getMenu() {
  return http.request(
    {
      url: '/menu/getMenu',
      method: 'POST',
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * 获取tree菜单列表
 * @param params
 */
export function getMenuList(params?) {
  return http.request(
    {
      url: '/menu/list',
      method: 'GET',
      params,
    },
    {
      isTransformResponse: false,
    }
  );
}
