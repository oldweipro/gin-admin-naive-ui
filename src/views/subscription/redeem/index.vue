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
        <n-button type="primary" @click="showModal = true">生成兑换码</n-button>
      </template>
    </BasicTable>
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
  import { columns } from './columns';
  import { CopyOutlined } from '@vicons/antd';
  import { RedeemRequest, RedeemResponse, RedeemSearch } from '@/model/redeem';
  import { generateRedeemCode, getRedeemCodeList } from '@/api/transaction/redeem';
  import { copyToClip } from '@/utils/copy';

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
    status: 0,
    expireTime: new Date().getTime(),
  });

  const actionColumn = reactive({
    width: 150,
    title: '操作',
    key: 'action',
    fixed: 'right',
    align: 'center',
    render(record: RedeemResponse) {
      return h(TableAction as any, {
        style: 'text',
        actions: createActions(record),
      });
    },
  });

  // 操作
  function createActions(record: RedeemResponse) {
    return [
      {
        label: '复制',
        type: 'primary',
        icon: CopyOutlined,
        onClick: handleCopyRedeemCode.bind(null, record),
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
  const handleCopyRedeemCode = async (record: RedeemResponse) => {
    await copyToClip(record.code);
  };

  // 关闭弹框
  const closeModal = () => {
    showModal.value = false;
    formValue.value = {
      amount: 0,
      expireTime: new Date().getTime(),
      perLimit: 1,
      pieces: 0,
      status: 0,
      totalCount: 1,
    };
  };

  // 新增 更新 执行
  const onPositiveClick = async () => {
    const createResponse = await generateRedeemCode(formValue.value);
    if (createResponse.code === 0) {
      window['$message'].success(createResponse.msg);
      closeModal();
      reloadTable();
    } else {
      window['$message'].success(createResponse.msg);
    }
  };

  // 重载页面
  function reloadTable() {
    actionRef.value.reload();
  }

  // 加载分页数据表格
  const loadDataTable = async (res: RedeemSearch) => {
    const result = await getRedeemCodeList(res);
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
