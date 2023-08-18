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
        <n-form-item label="标记" path="tag">
          <n-input-number
            placeholder="标记"
            :show-button="false"
            :precision="0"
            v-model:value="formValue.tag"
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
    createSubscriptionPlan,
    deleteSubscriptionPlan,
    getSubscriptionPlanList,
  } from '@/api/transaction/subscriptionPlan';
  import { columns } from './columns';
  // import { formatToDateTime } from '@/utils/dateUtil';
  import { SubscriptionPlan } from '@/model/subscriptionPlan';
  import { DeleteOutlined, EditOutlined } from '@vicons/antd';

  const formRef: any = ref(null);
  const actionRef = ref();

  const isEdit = ref(false);
  const showModal = ref(false);

  const rules = {
    name: {
      required: true,
      message: '请输入名字',
      trigger: 'blur',
    },
  };

  const formValue = ref<SubscriptionPlan>({
    name: '',
    description: '',
    price: 0,
    duration: 0,
    quantity: 0,
    menuId: 0,
    tag: 1,
    status: 1,
  });

  const actionColumn = reactive({
    width: 150,
    title: '操作',
    key: 'action',
    fixed: 'right',
    align: 'center',
    render(record) {
      return h(TableAction as any, {
        style: 'text',
        actions: createActions(record),
      });
    },
  });
  function createActions(record) {
    return [
      {
        label: '编辑',
        type: 'primary',
        icon: EditOutlined,
        onClick: handleEdit.bind(null, record),
        ifShow: () => {
          return true;
        },
        auth: ['basic_list'],
      },
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

  const handleDelete = async (record: SubscriptionPlan) => {
    const response = await deleteSubscriptionPlan(record);
    window['$message'].success(response.msg);
    reloadTable();
  };

  const handleEdit = (record) => {
    console.log('修改');
    console.log(record);
  };

  // add 新增订阅计划
  const onPositiveClick = async () => {
    isEdit.value = false;
    const result = await createSubscriptionPlan(formValue.value);
    console.log(result);
    if (result.code === 0) {
      window['$message'].success('添加成功');
      showModal.value = false;
      reloadTable();
    } else {
      window['$message'].success(result.msg);
    }
  };
  // 重载页面
  function reloadTable() {
    actionRef.value.reload();
  }
  // 加载页面数据表格 获取SubscriptionPlan列表
  const loadDataTable = async (res: SubscriptionPlan) => {
    const result = await getSubscriptionPlanList(res);
    if (result.code === 0) {
      // result.data.list.forEach((fb) => {
      //   fb.createdAt = formatToDateTime(fb.createdAt!);
      // });
      result.data.total = Math.ceil(result.data.total / result.data.pageSize);
      return result.data;
    } else {
      window['$message'].info(result.msg);
    }
  };

  function onCheckedRow(rowKeys) {
    console.log(rowKeys);
  }
</script>

<style lang="less" scoped></style>
