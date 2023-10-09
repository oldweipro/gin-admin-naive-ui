<template>
  <n-card :bordered="false" class="proCard">
    <n-spin :show="spinShow">
      <BasicTable
        :columns="columns"
        :request="loadDataTable"
        :row-key="(row) => row.id"
        ref="actionRef"
        :actionColumn="actionColumn"
        :scroll-x="100"
        @update:checked-row-keys="onCheckedRow"
      >
        <template #tableTitle>
          <n-space>
            <n-button type="primary" @click="openModal">登陆账号</n-button>
          </n-space>
        </template>
      </BasicTable>
    </n-spin>

    <n-modal
      v-model:show="showModal"
      :show-icon="false"
      preset="dialog"
      title="扫描二维码登陆"
      :on-after-leave="closeModal"
    >
      <n-form :label-width="120" label-placement="left" ref="formRef" class="py-8">
        <qrcode-vue
          :value="loginQrcodeGenerate.url"
          style="display: block; margin: 14px auto 14px"
        />
        <div style="margin-left: 80px">
          <n-space>
            <n-button type="primary" @click="onPositiveClick">确定</n-button>
          </n-space>
        </div>
      </n-form>
    </n-modal>
  </n-card>
</template>

<script lang="ts" setup>
  import { h, reactive, ref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { columns } from './columns';
  import { CopyOutlined } from '@vicons/antd';
  import { MailAccount, MailAccountIdsRequest, MailAccountSearch } from '@/model/mailAccount';
  import {
    getMailAccountList,
    refreshClaudeSessionKey,
    refreshOpenaiAccessToken,
  } from '@/api/mailAccount/mailAccount';
  import QrcodeVue from 'qrcode.vue';
  import { getLoginQrcodeGenerate, loginQrcodePoll } from '@/api/memoNexus/memoNexus';
  import { LoginQrcodeGenerate } from '@/model/memoNexus';

  const formRef: any = ref(null);
  const actionRef = ref();
  const checkedRowIds = ref<number[]>();
  const loginQrcodeGenerate = ref<LoginQrcodeGenerate>({
    qrcode_key: '',
    url: '',
  });

  // 行为控制标记（弹窗内部需要增还是改）
  const showModal = ref(false);
  const spinShow = ref(false);

  const actionColumn = reactive({
    width: 100,
    title: '操作',
    key: 'action',
    fixed: 'right',
    align: 'center',
    render(record: MailAccount) {
      return h(TableAction as any, {
        style: 'text',
        actions: createActions(record),
      });
    },
  });

  // 操作
  const openModal = async () => {
    // 请求b站登陆接口返回二维码
    const response = await getLoginQrcodeGenerate();
    if (response.code === 0) {
      loginQrcodeGenerate.value = response.data;
      showModal.value = true;
      // 获取回调函数
      const ginResponse = await loginQrcodePoll({
        qrcodeKey: loginQrcodeGenerate.value.qrcode_key,
      });
      window['$message'].info(ginResponse.msg);
      showModal.value = false;
    } else {
      window['$message'].info(response.msg);
    }
  };
  function createActions(record: MailAccount) {
    return [
      {
        label: '刷新SK',
        type: 'primary',
        icon: CopyOutlined,
        onClick: handleRefreshClaudeSessionKey.bind(null, record),
        // 根据业务控制是否显示 isShow 和 auth 是并且关系
        ifShow: () => {
          return true;
        },
        // 根据权限控制是否显示: 有权限，会显示，支持多个
        auth: ['basic_list'],
      },
      {
        label: '刷新AT',
        type: 'primary',
        icon: CopyOutlined,
        onClick: handleRefreshOpenaiAccessToken.bind(null, record),
        // 根据业务控制是否显示 isShow 和 auth 是并且关系
        ifShow: () => {
          return true;
        },
        // 根据权限控制是否显示: 有权限，会显示，支持多个
        auth: ['basic_list'],
      },
    ];
  }

  // 刷新 ClaudeSessionKey
  const handleRefreshClaudeSessionKey = async (record: MailAccount) => {
    spinShow.value = true;
    const ids: MailAccountIdsRequest = {
      ids: [record.id],
    };
    const response = await refreshClaudeSessionKey(ids);
    window['$message'].info(response.msg);
    spinShow.value = false;
    reloadTable();
  };

  // 刷新 OpenaiAccessToken
  const handleRefreshOpenaiAccessToken = async (record: MailAccount) => {
    spinShow.value = true;
    const ids: MailAccountIdsRequest = {
      ids: [record.id],
    };
    const response = await refreshOpenaiAccessToken(ids);
    window['$message'].info(response.msg);
    spinShow.value = false;
    reloadTable();
  };

  // 关闭弹框
  const closeModal = () => {
    showModal.value = false;
    loginQrcodeGenerate.value = {
      url: '',
      qrcode_key: '',
    };
  };

  // 新增 更新 执行
  const onPositiveClick = async () => {
    // const createResponse = await generateRedeemCode(formValue.value);
    // if (createResponse.code === 0) {
    //   window['$message'].success(createResponse.msg);
    //   closeModal();
    //   reloadTable();
    // } else {
    //   window['$message'].success(createResponse.msg);
    // }
  };

  // 重载页面
  function reloadTable() {
    actionRef.value.reload();
  }

  // 加载分页数据表格
  const loadDataTable = async (res: MailAccountSearch) => {
    const result = await getMailAccountList(res);
    if (result.code === 0) {
      result.data.total = Math.ceil(result.data.total / result.data.pageSize);
      return result.data;
    } else {
      window['$message'].info(result.msg);
    }
  };

  function onCheckedRow(rowKeys: number[]) {
    checkedRowIds.value = rowKeys;
    console.log(rowKeys);
  }
</script>

<style lang="less" scoped></style>
