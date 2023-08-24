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
          <n-button type="primary" @click="showModal = true">生成兑换码</n-button>
        </template>
      </BasicTable>
    </n-spin>

    <n-modal
      v-model:show="showModal"
      :show-icon="false"
      preset="dialog"
      title="生成兑换码"
      :on-after-leave="closeModal"
    >
      <n-form
        :label-width="80"
        :model="formValue"
        :rules="rules"
        label-placement="left"
        ref="formRef"
        class="py-8"
      >
        <n-form-item label="生成个数" path="username">
          <n-input placeholder="对应生成多少个兑换码记录" v-model:value="formValue.username" />
        </n-form-item>
        <n-form-item label="兑换码数量" path="password">
          <n-input placeholder="兑换码数量" v-model:value="formValue.password" />
        </n-form-item>
        <n-form-item label="昵称" path="nickName">
          <n-input placeholder="昵称" v-model:value="formValue.nickName" />
        </n-form-item>
        <div style="margin-left: 80px">
          <n-space>
            <n-button type="primary" @click="onPositiveClick">提交</n-button>
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
  import { getMailAccountList, refreshOpenaiAccessToken } from '@/api/mailAccount/mailAccount';

  const formRef: any = ref(null);
  const actionRef = ref();
  const checkedRowIds = ref<number[]>();

  // 行为控制标记（弹窗内部需要增还是改）
  const showModal = ref(false);
  const spinShow = ref(false);

  const rules = {
    name: {
      required: true,
      message: '请输入名字',
      trigger: 'blur',
    },
  };

  const formValue = ref<MailAccount>({
    id: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    username: '',
    nickName: '',
    remark: '',
    password: '',
    claudeSessionKey: '',
    claudeSessionKeyGetTime: new Date(),
    openaiPassword: '',
    openaiAccessToken: '',
    openaiAccessTokenGetTime: new Date(),
    openaiSkExpire: new Date(),
    openaiSk: '',
    openaiAmount: 0,
    openaiStatus: 0,
  });

  const actionColumn = reactive({
    width: 50,
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
  function createActions(record: MailAccount) {
    return [
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

  // 复制兑换码
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
    formValue.value = {
      id: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      username: '',
      nickName: '',
      remark: '',
      password: '',
      claudeSessionKey: '',
      claudeSessionKeyGetTime: new Date(),
      openaiPassword: '',
      openaiAccessToken: '',
      openaiAccessTokenGetTime: new Date(),
      openaiSkExpire: new Date(),
      openaiSk: '',
      openaiAmount: 0,
      openaiStatus: 0,
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
