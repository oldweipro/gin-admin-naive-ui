<template>
  <n-card :bordered="false" class="proCard">
    <n-space>
      <n-button type="primary" @click="activation = true">订阅</n-button>
    </n-space>
    <n-modal
      v-model:show="activation"
      :show-icon="false"
      preset="dialog"
      title="选择您的订阅计划"
      class="subModal"
      style="width: 50vh"
    >
      <n-spin :show="spinShow">
        <n-space justify="center" :vertical="isMobile">
          <n-card
            v-for="(item, index) of subscriptionPlanList"
            :key="index"
            :title="item.name"
            embedded
            :bordered="false"
            :class="[isMobile ? 'smallCard' : 'largeCard']"
          >
            <TextComponent ref="textRef" :text="item.description" />
            <n-button style="margin-top: 20px" type="primary" @click="subscribe(item)">
              订阅 {{ item.price }}
            </n-button>
          </n-card>
        </n-space>
      </n-spin>
    </n-modal>
    <n-spin :show="spinResultShow">
      <n-result
        status="success"
        title="激活码"
        :description="activationCode"
        v-if="hasActivationCode"
      >
        <template #footer>
          <n-button type="primary" @click="copyToClip(activationCode)">点击复制</n-button>
        </template>
      </n-result>
      <n-result
        status="403"
        title="403 禁止访问"
        description="总有些门是对你关闭的"
        v-if="!hasActivationCode"
      >
        <template #footer>
          <n-button @click="activation = true">放轻松</n-button>
        </template>
      </n-result>
    </n-spin>
  </n-card>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import {
    getActivationCodeStatus,
    getJetBrainsActivationCode,
  } from '@/api/activationCode/activationCode';
  import { useBasicLayout } from '@/hooks/chat/useBasicLayout';
  import { SubscribeRequest, SubscriptionPlan } from '@/model/subscriptionPlan';
  import { subscribePlan } from '@/api/transaction/subscriptionUser';
  import { getSubscriptionPlanByTag } from '@/api/transaction/subscriptionPlan';
  import { useWalletStore } from '@/store/modules/wallet';
  import TextComponent from '@/views/ai/chat/message/TextComponent.vue';
  import { copyToClip } from '@/utils/copy';

  const useWallet = useWalletStore();
  const spinShow = ref(false);
  const activation = ref(false);
  const { isMobile } = useBasicLayout();
  const subscriptionPlanList = ref<SubscriptionPlan[]>();
  const subscribe = async (plan: SubscriptionPlan) => {
    spinShow.value = true;
    if (plan.id === undefined) {
      window['$message'].error('必要参数为空');
      return;
    }
    const request: SubscribeRequest = {
      planId: plan.id!,
    };
    const ginResponse = await subscribePlan(request);
    if (ginResponse.msg === '余额不足') {
      // 显示充值页面
      useWallet.setShowModal(true);
    } else {
      window['$message'].info(ginResponse.msg);
    }
    spinShow.value = false;
    closeSubscription();
    await loadData();
  };
  const closeSubscription = () => {
    activation.value = false;
  };
  // getCurrentSubscriptionPlan 查询当前用户订阅计划
  const loadSubscriptionPlan = async () => {
    const result = await getSubscriptionPlanByTag({ tag: 2 });
    if (result.code === 0) {
      subscriptionPlanList.value = result.data;
    }
  };
  loadSubscriptionPlan();

  const spinResultShow = ref(true);
  const hasActivationCode = ref(false);
  const activationCode = ref('');
  const loadData = async () => {
    const statusResp = await getActivationCodeStatus();
    if (statusResp.code === 0) {
      const activationResp = await getJetBrainsActivationCode();
      if (activationResp.code === 0) {
        activationCode.value = activationResp.data;
        await copyToClip(activationCode.value);
        // activationCode.value = activationResp.data.substring(0, 30) + '...';
      }
      hasActivationCode.value = true;
    } else {
      window['$message'].info(statusResp.msg);
    }
    spinResultShow.value = false;
  };
  loadData();
</script>

<style lang="less" scoped></style>
