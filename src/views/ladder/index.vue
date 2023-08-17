<template>
  <n-card :bordered="false" class="proCard">
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row) => row.id"
      ref="actionRef"
      :actionColumn="actionColumn"
      :scroll-x="1390"
      @update:checked-row-keys="onCheckedRow"
    >
      <template #tableTitle>
        <n-button type="primary" @click="activation = true"> 订阅 </n-button>
        仅用于学习
      </template>
    </BasicTable>
    <n-modal
      v-model:show="activation"
      :mask-closable="false"
      preset="dialog"
      title="确认"
      content="将扣除xxx"
      positive-text="确认"
      negative-text="算了"
      @positive-click="onPositiveClick"
      @negative-click="onNegativeClick"
    />
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
            >导入Clash</n-button
          >
          <n-button type="info" :loading="formBtnLoading" @click="confirmFormCopyLink64"
            >复制链接</n-button
          >
        </n-space>
      </template>
    </n-modal>
  </n-card>
</template>

<script lang="ts" setup>
  import { h, reactive, ref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import {
    findInboundsLink,
    setInboundsLink,
    getServerNodeList,
    getCurrentSubscriptionPlan,
    getSubscriptionPlanByTag,
  } from '@/api/ladder/ladder';
  import { columns } from './columns';
  import { formatToDateTime } from '@/utils/dateUtil';
  import hljs from 'highlight.js';
  import QrcodeVue from 'qrcode.vue';
  import { copyToClip } from '@/utils/copy';

  const formRef: any = ref(null);
  const actionRef = ref();
  const subscriptionPlan = ref();

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
    width: 80,
    title: '操作',
    key: 'action',
    fixed: 'right',
    align: 'center',
    render(record) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: '导入Clash',
            onClick: getInboundsLinkImportClash.bind(null, record),
            // 根据业务控制是否显示 isShow 和 auth 是并且关系
            ifShow: () => {
              return true;
            },
            // 根据权限控制是否显示: 有权限，会显示，支持多个
            auth: ['basic_list'],
          },
          {
            label: '🔗复制链接',
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

  // getCurrentSubscriptionPlan 查询当前用户订阅计划
  const loadSubscriptionPlan = async () => {
    const result = await getSubscriptionPlanByTag({ tag: 1 });
    if (result.code === 0) {
      // const status = result.data.subscriptionUser;
      console.log(result.data);
    } else {
      console.log('暂无信息');
    }
  };
  loadSubscriptionPlan();
  const loadCurrentSubscriptionPlan = async () => {
    const result = await getCurrentSubscriptionPlan();
    if (result.code === 0) {
      const status = result.data.subscriptionUser.status;
      if (status) {
        activation.value = true;
      }
    }
  };
  loadCurrentSubscriptionPlan();

  const onNegativeClick = async () => {
    window['$message'].success('取消');
    activation.value = false;
  };
  const onPositiveClick = async () => {
    window['$message'].success('订阅');
    activation.value = false;
  };

  const loadDataTable = async (res) => {
    const result = await getServerNodeList(res);
    if (result.code === 0) {
      const serverNodeList = result.data;
      serverNodeList.list.forEach((fb) => {
        fb.CreatedAt = formatToDateTime(new Date(fb.CreatedAt));
      });
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
    await reloadTable();
  };

  // 导入Clash
  const getInboundsLinkImportClash = async (record: Recordable) => {
    // 组装链接并打开新标签页
    const { code, data, msg } = await findInboundsLink({ sid: record.ID });
    if (code === 0) {
      inboundsData.value = data.inboundsData;
      inboundsData.value.domain = data.domain;
      inboundsData.value.region = data.region;
      await copyToClip(inboundsData.value.clashSub || '');
      window['$message'].success('复制成功');
      const url = 'clash://install-config?url=';
      window.open(url + encodeURIComponent(inboundsData.value.clashSub));
    } else {
      window['$message'].error(msg);
    }
  };

  // 导入Clash
  const confirmFormImportClash = async () => {
    // 复制到剪切板
    try {
      await copyToClip(inboundsData.value.clashSub || '');
      window['$message'].success('复制成功');
      const url = 'clash://install-config?url=';
      window.open(url + encodeURIComponent(inboundsData.value.clashSub));
    } catch (e) {
      window['$message'].error('复制失败');
    }
    showModal.value = false;
    await reloadTable();
  };

  // 复制链接
  const confirmFormCopyLink64 = async () => {
    // 复制到剪切板
    try {
      await copyToClip(inboundsData.value.link64 || '');
      window['$message'].success('复制成功');
    } catch (e) {
      window['$message'].error('您的浏览器不支持复制');
    }
    showModal.value = false;
    await reloadTable();
  };

  const getInboundsLinkCopyLink64 = async (record: Recordable) => {
    const { code, data, msg } = await findInboundsLink({ sid: record.ID });
    if (code === 0) {
      inboundsData.value = data.inboundsData;
      inboundsData.value.domain = data.domain;
      inboundsData.value.region = data.region;
      showModal.value = true;
      await copyToClip(inboundsData.value.link64 || '');
      window['$message'].success('复制成功');
    } else {
      window['$message'].error(msg);
    }
  };
</script>

<style lang="less" scoped></style>
