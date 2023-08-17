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
        <n-button type="primary" @click="showModal = true"> 新增 </n-button>
      </template>
    </BasicTable>
    <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" title="节点信息">
      <n-form
        :label-width="80"
        :model="formValue"
        :rules="rules"
        label-placement="left"
        ref="formRef"
        class="py-8"
      >
        <n-form-item label="编号" path="ID">
          <n-input-number
            placeholder="编号"
            :show-button="false"
            :precision="0"
            v-model:value="formValue.ID"
          />
        </n-form-item>
        <n-form-item label="订阅计划" path="name">
          <n-input v-model:value="formValue.name" placeholder="订阅计划名字" />
        </n-form-item>
        <n-form-item label="描述" path="description">
          <n-input placeholder="描述" v-model:value="formValue.description" />
        </n-form-item>
        <n-form-item label="价格" path="price">
          <n-input-number
            placeholder="价格"
            :show-button="false"
            :precision="0"
            v-model:value="formValue.price"
          />
        </n-form-item>
        <n-form-item label="时长" path="duration">
          <n-input-number
            placeholder="时长"
            :show-button="false"
            :precision="0"
            v-model:value="formValue.duration"
          />
        </n-form-item>
        <n-form-item label="数量" path="quantity">
          <n-input-number
            placeholder="数量"
            :show-button="false"
            :precision="0"
            v-model:value="formValue.quantity"
          />
        </n-form-item>
        <n-form-item label="菜单ID" path="menuId">
          <n-input-number
            placeholder="菜单ID"
            :show-button="false"
            :precision="0"
            v-model:value="formValue.menuId"
          />
        </n-form-item>
        <div style="margin-left: 80px">
          <n-space>
            <n-button type="primary" @click="onPositiveClick">提交预约</n-button>
            <n-button @click="onNegativeClick">重置</n-button>
          </n-space>
        </div>
      </n-form>
    </n-modal>
  </n-card>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { BasicTable } from '@/components/Table';
  import {
    getServerNodeList,
    getCurrentSubscriptionPlan,
    getSubscriptionPlan,
    createSubscriptionPlan,
  } from '@/api/ladder/ladder';
  import { columns } from './columns';
  import { formatToDateTime } from '@/utils/dateUtil';
  import { SubscriptionPlan } from '@/model/subscriptionPlan';

  const formRef: any = ref(null);
  const actionRef = ref();

  const activation = ref(false);
  const showModal = ref(false);

  const rules = {
    ID: {
      required: true,
      message: '请输入编号',
      trigger: 'blur',
    },
    name: {
      required: true,
      message: '请输入名字',
      trigger: 'blur',
    },
  };

  const formValue = ref<SubscriptionPlan>({
    ID: 0,
    name: '',
    description: '',
    price: 0,
    duration: 0,
    quantity: 0,
    menuId: 0,
  });

  const actionColumn = reactive({
    width: 80,
    title: '操作',
    key: 'action',
    fixed: 'right',
    align: 'center',
  });

  // getCurrentSubscriptionPlan 查询当前用户订阅计划
  const loadSubscriptionPlan = async () => {
    const result = await getSubscriptionPlan({ ID: 1 });
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
    console.log(formValue.value);
    const result = await createSubscriptionPlan(formValue.value);
    console.log(result);
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

  function onCheckedRow(rowKeys) {
    console.log(rowKeys);
  }
</script>

<style lang="less" scoped></style>
