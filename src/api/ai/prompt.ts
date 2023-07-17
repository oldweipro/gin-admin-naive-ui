import { http } from '@/utils/http/axios';

/**
 * @description: 获取当前用户prompt
 */
export function getCurrentUserPromptList(param) {
  return http.request(
    {
      url: `/prompt/getCurrentUserPromptList?page=${param.page}&pageSize=${param.pageSize}`,
      method: 'GET',
    },
    {
      isTransformResponse: false,
    }
  );
}
