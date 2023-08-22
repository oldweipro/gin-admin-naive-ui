<template>
  <n-card :bordered="false" class="proCard">
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row) => row.id"
      ref="actionRef"
      :actionColumn="actionColumn"
      :scroll-x="150"
      @update:checked-row-keys="onCheckedRow"
    >
      <template #tableTitle>
        <n-space justify="center">
          <n-button type="primary" @click="activation = true">订阅</n-button>
        </n-space>
      </template>
    </BasicTable>
    <n-modal
      v-model:show="activation"
      :show-icon="false"
      preset="dialog"
      title="选择您的订阅计划"
      class="subModal"
      style="width: 95vh"
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
    <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" title="节点信息">
      <n-form
        :model="inboundsData"
        ref="formRef"
        label-placement="left"
        :label-width="80"
        class="py-4"
      >
        <qrcode-vue :value="inboundsData.link64" style="display: block; margin: 14px auto 14px" />
        <n-form-item label="地址:" path="feedbackText">
          <n-code :code="inboundsData.domain" :hljs="hljs" language="text" inline />
        </n-form-item>
        <n-form-item label="端口:" path="feedbackText">
          <n-code :code="inboundsData.port" :hljs="hljs" language="text" inline />
        </n-form-item>
        <n-form-item label="uuid:" path="feedbackText">
          <n-code :code="inboundsData.clientId" :hljs="hljs" language="text" inline />
        </n-form-item>
        <n-form-item label="alterId:" path="feedbackText">
          <n-code code="0" :hljs="hljs" language="text" inline />
        </n-form-item>
        <n-form-item label="传输协议:" path="feedbackText">
          <n-code :code="inboundsData.protocol" :hljs="hljs" language="text" inline />
        </n-form-item>
        <n-form-item label="路径:" path="feedbackText">
          <n-code code="/" :hljs="hljs" language="text" inline />
        </n-form-item>
        <n-form-item label="重置链接:" path="feedbackText">
          <n-button @click="resetInboundsLink">重置</n-button>
        </n-form-item>
      </n-form>

      <template #action>
        <n-space>
          <n-button @click="() => (showModal = false)">取消</n-button>
          <n-button type="info" :loading="formBtnLoading" @click="confirmFormImportClash"
            >导入Clash
          </n-button>
          <n-button type="info" :loading="formBtnLoading" @click="confirmFormCopyLink64"
            >复制链接
          </n-button>
        </n-space>
      </template>
    </n-modal>
  </n-card>
</template>

<script lang="ts" setup>
  import { h, reactive, ref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { findInboundsLink, getServerNodeList, setInboundsLink } from '@/api/ladder/ladder';
  import { columns } from './columns';
  import hljs from 'highlight.js';
  import QrcodeVue from 'qrcode.vue';
  import { copyToClip } from '@/utils/copy';
  import { SubscribeRequest, SubscriptionPlan, SubscriptionUser } from '@/model/subscriptionPlan';
  import {
    getCurrentSubscriptionPlan,
    getSubscriptionPlanByTag,
  } from '@/api/transaction/subscriptionPlan';
  import { subscribePlan } from '@/api/transaction/subscriptionUser';
  import TextComponent from '@/views/ai/chat/message/TextComponent.vue';
  import { useBasicLayout } from '@/hooks/chat/useBasicLayout';
  import { useWalletStore } from '@/store/modules/wallet';

  const useWallet = useWalletStore();

  const { isMobile } = useBasicLayout();
  const formRef: any = ref(null);
  const actionRef = ref();
  const subscriptionPlanList = ref<SubscriptionPlan[]>();

  const subscriptionUser = ref<SubscriptionUser>({
    subscriptionPlanId: 0,
    userId: 0,
    status: 0,
  });

  const spinShow = ref(false);
  const activation = ref(false);
  const showModal = ref(false);
  const formBtnLoading = ref(false);
  const inboundsData = ref({
    clientId: '',
    up: 0,
    down: 0,
    total: 0,
    remark: '',
    enable: true,
    expiryTime: 0,
    port: '0',
    protocol: '',
    settings: '',
    streamSettings: '',
    sniffing: '',
    listen: '',
    uid: 0,
    sid: 0,
    link: '',
    link64: '',
    domain: '地址不可用',
    region: '节点信息',
    clashSub: '',
  });

  const actionColumn = reactive({
    width: 100,
    title: '操作',
    key: 'action',
    fixed: 'right',
    align: 'center',
    render(record) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: 'Clash',
            onClick: getInboundsLinkImportClash.bind(null, record),
            // 根据业务控制是否显示 isShow 和 auth 是并且关系
            ifShow: () => {
              return true;
            },
            // 根据权限控制是否显示: 有权限，会显示，支持多个
            auth: ['basic_list'],
          },
          {
            label: '🔎',
            onClick: getInboundsLinkCopyLink64.bind(null, record),
            // 根据业务控制是否显示 isShow 和 auth 是并且关系
            ifShow: () => {
              return true;
            },
            // 根据权限控制是否显示: 有权限，会显示，支持多个
            auth: ['basic_list'],
          },
        ],
        select: (key) => {
          window['$message'].info(`您点击了，${key} 按钮`);
        },
      });
    },
  });

  const openSubscription = () => {
    activation.value = true;
  };

  const closeSubscription = () => {
    activation.value = false;
  };

  // getCurrentSubscriptionPlan 查询当前用户订阅计划
  const loadSubscriptionPlan = async () => {
    const result = await getSubscriptionPlanByTag({ tag: 1 });
    if (result.code === 0) {
      subscriptionPlanList.value = result.data;
    }
  };
  loadSubscriptionPlan();
  const loadCurrentSubscriptionPlan = async () => {
    const result = await getCurrentSubscriptionPlan();
    if (result.code === 0) {
      subscriptionUser.value = result.data;
    }
  };
  loadCurrentSubscriptionPlan();

  const loadDataTable = async (res) => {
    const result = await getServerNodeList(res);
    if (result.code === 0) {
      const serverNodeList = result.data;
      serverNodeList.total = Math.ceil(serverNodeList.total / serverNodeList.pageSize);
      return serverNodeList;
    } else {
      window['$message'].info(result.msg);
    }
  };

  function reloadTable() {
    actionRef.value.reload();
  }

  function onCheckedRow(rowKeys) {
    console.log(rowKeys);
  }

  const resetInboundsLink = async () => {
    const { msg } = await setInboundsLink(inboundsData.value);
    window['$message'].success(msg);
    showModal.value = false;
    reloadTable();
  };

  // 导入Clash
  const getInboundsLinkImportClash = async (record: Recordable) => {
    // 组装链接并打开新标签页
    const { code, data, msg } = await findInboundsLink({ sid: record.id });
    if (code === 0) {
      inboundsData.value = data.inboundsData;
      inboundsData.value.domain = data.domain;
      inboundsData.value.region = data.region;
      await copyToClip(inboundsData.value.clashSub || '');
      const url = 'clash://install-config?url=';
      window.open(url + encodeURIComponent(inboundsData.value.clashSub));
    } else {
      openSubscription();
      window['$message'].error(msg);
    }
  };

  // 导入Clash
  const confirmFormImportClash = async () => {
    // 复制到剪切板
    try {
      await copyToClip(inboundsData.value.clashSub || '');
      const url = 'clash://install-config?url=';
      window.open(url + encodeURIComponent(inboundsData.value.clashSub));
    } catch (e) {
      window['$message'].error('复制失败');
    }
    showModal.value = false;
    reloadTable();
  };

  // 复制链接
  const confirmFormCopyLink64 = async () => {
    // 复制到剪切板
    try {
      await copyToClip(inboundsData.value.link64 || '');
    } catch (e) {
      window['$message'].error('您的浏览器不支持复制');
    }
    showModal.value = false;
    reloadTable();
  };

  const getInboundsLinkCopyLink64 = async (record: Recordable) => {
    const { code, data, msg } = await findInboundsLink({ sid: record.id });
    if (code === 0) {
      inboundsData.value = data.inboundsData;
      inboundsData.value.domain = data.domain;
      inboundsData.value.region = data.region;
      showModal.value = true;
      await copyToClip(inboundsData.value.link64 || '');
    } else {
      openSubscription();
      window['$message'].error(msg);
    }
  };

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
      // 显示重置页面
      useWallet.setShowModal(true);
    } else {
      window['$message'].info(ginResponse.msg);
      reloadTable();
    }
    spinShow.value = false;
    closeSubscription();
  };
</script>

<style lang="less" scoped>
  .light-green {
    height: 108px;
    background-color: rgba(0, 128, 0, 0.12);
  }

  .green {
    height: 108px;
    background-color: rgba(0, 128, 0, 0.24);
  }

  .smallCard {
    width: 308px;
  }

  .largeCard {
    width: 408px;
  }
</style>
