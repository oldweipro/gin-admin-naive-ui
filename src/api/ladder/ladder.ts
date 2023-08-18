import { http } from '@/utils/http/axios';
import { GinResponse } from '@/model/ginResponse';
import { SubscriptionPlan } from '@/model/subscriptionPlan';

/**
 * @description: 获取节点列表
 */
export function getServerNodeList(data) {
  return http.request(
    {
      url: `/serverNode/getServerNodeLessList?page=${data.page}&pageSize=${data.pageSize}`,
      method: 'GET',
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 查看链接
 */
export function findInboundsLink(data) {
  return http.request(
    {
      url: `/inbounds/findInboundsLink?sid=${data.sid}`,
      method: 'GET',
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 重置链接
 */
export function setInboundsLink(data) {
  return http.request(
    {
      url: '/inbounds/setInboundsLink',
      method: 'POST',
      data,
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 查询订阅计划
 */
export function createSubscriptionPlan(data) {
  return http.request(
    {
      url: '/subscriptionPlan/createSubscriptionPlan',
      method: 'POST',
      data,
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 查询订阅计划
 */
export function getSubscriptionPlan(params) {
  return http.request<GinResponse<SubscriptionPlan>>(
    {
      url: '/subscriptionPlan/getSubscriptionPlan',
      method: 'GET',
      params,
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 查询订阅计划
 */
export function getSubscriptionPlanByTag(params) {
  return http.request<GinResponse<SubscriptionPlan>>(
    {
      url: '/subscriptionPlan/getSubscriptionPlanByTag',
      method: 'GET',
      params,
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 查询当前用户订阅计划
 */
export function getCurrentSubscriptionPlan() {
  return http.request<GinResponse<SubscriptionPlan>>(
    {
      url: '/subscriptionPlan/getCurrentSubscriptionPlan',
      method: 'GET',
    },
    {
      isTransformResponse: false,
    }
  );
}
