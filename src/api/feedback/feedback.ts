import { http } from '@/utils/http/axios';

/**
 * @description: 获取Feedback列表
 */
export function getFeedbackList(data) {
  return http.request(
    {
      url: `/feedback/getFeedbackList?page=${data.page}&pageSize=${data.pageSize}`,
      method: 'GET',
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 新建Feedback
 */
export function createFeedback(data) {
  return http.request(
    {
      url: '/feedback/createFeedback',
      method: 'POST',
      data,
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 删除Feedback
 */
export function deleteFeedback(data) {
  return http.request(
    {
      url: '/feedback/deleteFeedback',
      method: 'DELETE',
      data,
    },
    {
      isTransformResponse: false,
    }
  );
}
