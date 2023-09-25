import { http } from '@/utils/http/axios';
import { GinResponse } from '@/model/ginResponse';
import {
  MailAccount,
  MailAccountIdsRequest,
  MailAccountPage,
  MailAccountSearch,
} from '@/model/mailAccount';

/**
 * @description: 获取分页列表
 */
export function getMailAccountList(params: MailAccountSearch) {
  return http.request<GinResponse<MailAccountPage<MailAccount>>>(
    {
      url: '/mailAccount/getMailAccountList',
      method: 'GET',
      params,
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 刷新 openai AccessToken
 */
export function refreshOpenaiAccessToken(data: MailAccountIdsRequest) {
  return http.request<GinResponse<any>>(
    {
      url: '/mailAccount/refreshOpenaiAccessToken',
      method: 'POST',
      data,
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 刷新 Claude SessionKey
 */
export function refreshClaudeSessionKey(data: MailAccountIdsRequest) {
  return http.request<GinResponse<any>>(
    {
      url: '/mailAccount/refreshClaudeChat',
      method: 'POST',
      data,
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 同步 openai AccessToken
 */
export function syncChatGPTAccessToken() {
  return http.request<GinResponse<any>>(
    {
      url: '/mailAccount/syncChatGPTAccessToken',
      method: 'POST',
    },
    {
      isTransformResponse: false,
    }
  );
}
