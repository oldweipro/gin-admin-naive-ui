import { http } from '@/utils/http/axios';

/**
 * @description: 获取当前用户聊天记录
 */
export function getCurrentUserConversationList() {
  return http.request(
    {
      url: '/conversation/getCurrentUserConversationList',
      method: 'GET',
    },
    {
      isTransformResponse: false,
    }
  );
}
