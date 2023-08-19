import { http } from '@/utils/http/axios';
import { GinResponse } from '@/model/ginResponse';
import { SubscriptionPlan } from '@/model/subscriptionPlan';
import { GinPageTable } from '@/model/ginPageTable';

/**
 * @description: 获取SubscriptionPlan列表
 */
export function getSubscriptionPlanList(params: SubscriptionPlan) {
  return http.request<GinResponse<GinPageTable<SubscriptionPlan>>>(
    {
      url: '/subscriptionPlan/getSubscriptionPlanList',
      method: 'GET',
      params,
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 创建订阅计划
 */
export function createSubscriptionPlan(data: SubscriptionPlan) {
  return http.request<GinResponse<any>>(
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
 * @description: 更新订阅计划
 */
export function updateSubscriptionPlan(data: SubscriptionPlan) {
  return http.request<GinResponse<any>>(
    {
      url: '/subscriptionPlan/updateSubscriptionPlan',
      method: 'PUT',
      data,
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 删除订阅计划
 */
export function deleteSubscriptionPlan(data: SubscriptionPlan) {
  return http.request<GinResponse<any>>(
    {
      url: '/subscriptionPlan/deleteSubscriptionPlan',
      method: 'DELETE',
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
  return http.request<GinResponse<SubscriptionPlan[]>>(
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
