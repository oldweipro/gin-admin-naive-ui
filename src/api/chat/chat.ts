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

/**
 * @description: 修改聊天室名字
 */
export function updateConversation(data) {
  return http.request(
    {
      url: '/conversation/updateConversationName',
      method: 'POST',
      data,
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 删除对话
 */
export function deleteConversation(data) {
  return http.request(
    {
      url: '/conversation/deleteConversation',
      method: 'POST',
      data,
    },
    {
      isTransformResponse: false,
    }
  );
}
