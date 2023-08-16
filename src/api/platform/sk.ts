import { http } from '@/utils/http/axios';

/**
 * @description: 获取Feedback列表
 */
export function getSecretKeyList(data) {
  return http.request(
    {
      url: `/secretKey/getSecretKeyList?page=${data.page}&pageSize=${data.pageSize}`,
      method: 'GET',
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 新建 sk
 */
export function createSecretKey(data) {
  return http.request(
    {
      url: '/secretKey/createSecretKey',
      method: 'POST',
      data,
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 删除 sk
 */
export function deleteSecretKey(data) {
  return http.request(
    {
      url: '/secretKey/deleteSecretKey',
      method: 'DELETE',
      data,
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 删除 sk
 */
export function findSecretKey(params) {
  return http.request(
    {
      url: '/secretKey/findSecretKey',
      method: 'GET',
      params,
    },
    {
      isTransformResponse: false,
    }
  );
}
