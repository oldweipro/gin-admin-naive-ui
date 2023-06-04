import { http } from '@/utils/http/axios';
import type { AxiosProgressEvent, GenericAbortSignal } from 'axios';
import { MD5 } from 'crypto-js';

/**
 * @description: 获取当前用户聊天记录
 */
export function getCurrentUserConversationList(params) {
  return http.request(
    {
      url: `/conversation/getCurrentUserConversationList?conversationType=${params.conversationType}`,
      method: 'GET',
    },
    {
      isTransformResponse: false,
    }
  );
}
/**
 * @description: AI对话接口
 */
export function chatCompletions(params: {
  prompt: string;
  conversationId: number;
  signal?: GenericAbortSignal;
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void;
}) {
  const str = `${params.prompt}-${params.conversationId}5eb63bbbe01eeed093cb22bb8f5acdc3`;
  const encryptedStr = MD5(str).toString();
  const data: Record<string, any> = {
    prompt: params.prompt,
    conversationId: params.conversationId,
    sign: encryptedStr,
  };
  return http.request(
    {
      url: '/conversation/chatCompletions',
      method: 'POST',
      data,
      timeout: 1000 * 60 * 30,
      signal: params.signal,
      onDownloadProgress: params.onDownloadProgress,
    },
    {
      isTransformResponse: false,
    }
  );
}
/**
 * @description: AI作图
 */
export function openAIDrawing(params: {
  prompt: string;
  conversationId: number;
  signal?: GenericAbortSignal;
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void;
}) {
  const str = `${params.prompt}-${params.conversationId}5eb63bbbe01eeed093cb22bb8f5acdc3`;
  const encryptedStr = MD5(str).toString();
  const data: Record<string, any> = {
    prompt: params.prompt,
    conversationId: params.conversationId,
    sign: encryptedStr,
  };
  return http.request(
    {
      url: '/conversation/openAIDrawing',
      method: 'POST',
      data,
      timeout: 1000 * 60 * 30,
      signal: params.signal,
      onDownloadProgress: params.onDownloadProgress,
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
 * @description: 创建聊天室
 */
export function createConversation(data) {
  return http.request(
    {
      url: '/conversation/createConversation',
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
