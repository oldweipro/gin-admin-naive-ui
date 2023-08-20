<template>
  <n-card :bordered="false" class="proCard">
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
        <n-button type="primary" @click="showModal = true"> 生成兑换码</n-button>
      </template>
    </BasicTable>
    <n-modal
      v-model:show="showModal"
      :show-icon="false"
      preset="dialog"
      title="订阅计划"
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
        <n-form-item label="生成个数" path="pieces">
          <n-input-number
            placeholder="对应生成多少个兑换码记录"
            :show-button="false"
            :precision="0"
            v-model:value="formValue.pieces"
          />
        </n-form-item>
        <n-form-item label="兑换码数量" path="totalCount">
          <n-input-number
            placeholder="兑换码数量"
            :show-button="false"
            :precision="0"
            v-model:value="formValue.totalCount"
          />
        </n-form-item>
        <n-form-item label="面额" path="amount">
          <n-input-number
            placeholder="面额"
            :show-button="false"
            :precision="0"
            v-model:value="formValue.amount"
          />
        </n-form-item>
        <n-form-item label="频次" path="perLimit">
          <n-input-number
            placeholder="使用次数限制"
            :show-button="false"
            :precision="0"
            v-model:value="formValue.perLimit"
          />
        </n-form-item>
        <n-form-item label="有效期" path="expireTime">
          <n-date-picker
            v-model:value="formValue.expireTime"
            placeholder="有效期，过期时间"
            type="datetime"
            clearable
          />
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
  import {
    deleteSubscriptionPlan,
    getSubscriptionPlanList,
  } from '@/api/transaction/subscriptionPlan';
  import { columns } from './columns';
  import { SubscriptionPlan } from '@/model/subscriptionPlan';
  import { DeleteOutlined } from '@vicons/antd';
  import { RedeemRequest } from '@/model/redeem';
  import { generateRedeemCode } from '@/api/transaction/redeem';

  const formRef: any = ref(null);
  const actionRef = ref();
  const checkedRowIds = ref<number[]>();

  // 行为控制标记（弹窗内部需要增还是改）
  const showModal = ref(false);

  const rules = {
    name: {
      required: true,
      message: '请输入名字',
      trigger: 'blur',
    },
  };

  const formValue = ref<RedeemRequest>({
    pieces: 0,
    totalCount: 1,
    amount: 0,
    perLimit: 1,
    expireTime: new Date().getTime(),
  });

  const actionColumn = reactive({
    width: 150,
    title: '操作',
    key: 'action',
    fixed: 'right',
    align: 'center',
    render(record: SubscriptionPlan) {
      return h(TableAction as any, {
        style: 'text',
        actions: createActions(record),
      });
    },
  });

  // 操作
  function createActions(record: SubscriptionPlan) {
    return [
      {
        label: '删除',
        type: 'error',
        // 配置 color 会覆盖 type
        color: 'red',
        icon: DeleteOutlined,
        onClick: handleDelete.bind(null, record),
        // 根据业务控制是否显示 isShow 和 auth 是并且关系
        ifShow: () => {
          return true;
        },
        // 根据权限控制是否显示: 有权限，会显示，支持多个
        auth: ['basic_list'],
      },
    ];
  }

  // 删除
  const handleDelete = async (record: SubscriptionPlan) => {
    const response = await deleteSubscriptionPlan(record);
    window['$message'].success(response.msg);
    reloadTable();
  };

  // 关闭弹框
  const closeModal = () => {
    showModal.value = false;
    formValue.value = { amount: 0, expireTime: 0, perLimit: 0, pieces: 0, totalCount: 0 };
  };

  // 新增 更新 执行
  const onPositiveClick = async () => {
    const createResponse = await generateRedeemCode(formValue.value);
    if (createResponse.code === 0) {
      window['$message'].success('添加成功');
      closeModal();
      reloadTable();
      // TODO 清理formValue
    } else {
      window['$message'].success(createResponse.msg);
    }
  };

  // 重载页面
  function reloadTable() {
    actionRef.value.reload();
  }

  // 加载分页数据表格
  const loadDataTable = async (res: SubscriptionPlan) => {
    const result = await getSubscriptionPlanList(res);
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
