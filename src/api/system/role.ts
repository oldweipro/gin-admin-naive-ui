import { http } from '@/utils/http/axios';

/**
 * @description: 角色列表
 */
export function getRoleList(params) {
  return http.request(
    {
      url: '/authority/getAuthorityList',
      method: 'POST',
      params,
    },
    {
      isTransformResponse: false,
    }
  );
}
