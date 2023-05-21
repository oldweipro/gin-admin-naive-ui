import { http } from '@/utils/http/axios';

/**
 * @description: 角色列表
 */
export function getRoleList() {
  return http.request(
    {
      url: '/authority/list',
      method: 'GET',
    },
    {
      isTransformResponse: false,
    }
  );
}
