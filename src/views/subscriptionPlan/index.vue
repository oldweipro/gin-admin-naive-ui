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
        <n-form-item label="订阅计划" path="name">
          <n-input v-model:value="formValue.name" placeholder="订阅计划名字" />
        </n-form-item>
        <n-form-item label="描述" path="mobile">
          <n-input placeholder="描述" v-model:value="formValue.description" />
        </n-form-item>
        <n-form-item label="价格" path="mobile">
          <n-input
            placeholder="价格"
            type="text"
            :allow-input="onlyAllowNumber"
            v-model:value="formValue.price"
          />
        </n-form-item>
        <n-form-item label="时长" path="mobile">
          <n-input
            placeholder="时长"
            type="text"
            :allow-input="onlyAllowNumber"
            v-model:value="formValue.duration"
          />
        </n-form-item>
        <n-form-item label="数量" path="mobile">
          <n-input
            placeholder="数量"
            type="text"
            :allow-input="onlyAllowNumber"
            v-model:value="formValue.quantity"
          />
        </n-form-item>
        <n-form-item label="菜单ID" path="mobile">
          <n-input
            placeholder="菜单ID"
            type="text"
            :allow-input="onlyAllowNumber"
            v-model:value="formValue.menuId"
          />
        </n-form-item>
        <n-form-item label="标记" path="mobile">
          <n-input
            placeholder="标记"
            type="text"
            :allow-input="onlyAllowNumber"
            v-model:value="formValue.tag"
          />
        </n-form-item>
        <div style="margin-left: 80px">
          <n-space>
            <n-button type="primary" @click="onNegativeClick">提交预约</n-button>
            <n-button @click="onPositiveClick">重置</n-button>
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
    getSubscriptionPlanByTag,
  } from '@/api/ladder/ladder';
  import { columns } from './columns';
  import { formatToDateTime } from '@/utils/dateUtil';

  const formRef: any = ref(null);
  const actionRef = ref();

  const activation = ref(false);
  const showModal = ref(false);

  const rules = {
    name: {
      required: true,
      message: '请输入名字',
      trigger: 'blur',
    },
  };

  // const defaultValueRef: SubscriptionPlan = {
  //   name: '',
  //   description: '',
  //   price: 0,
  //   duration: 0,
  //   quantity: 0,
  //   menuId: 0,
  //   tag: 0,
  // };

  const defaultValueRef = () => ({
    name: '',
    description: '',
    price: '0',
    duration: '0',
    quantity: '0',
    menuId: '0',
    tag: '0',
  });

  let formValue = reactive(defaultValueRef());

  const actionColumn = reactive({
    width: 80,
    title: '操作',
    key: 'action',
    fixed: 'right',
    align: 'center',
  });

  const onlyAllowNumber = (value: string) => !value || /^\d+$/.test(value);

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

  function onCheckedRow(rowKeys) {
    console.log(rowKeys);
  }
</script>

<style lang="less" scoped></style>
