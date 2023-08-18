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
        <n-button type="primary" @click="addTable">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          新建
        </n-button>
      </template>
    </BasicTable>

    <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" title="新建反馈">
      <n-form
        :model="formParams"
        :rules="rules"
        ref="formRef"
        label-placement="left"
        :label-width="80"
        class="py-4"
      >
        <n-form-item label="反馈" path="feedbackText">
          <n-input
            type="textarea"
            placeholder="请输入您的反馈"
            v-model:value="formParams.feedbackText"
          />
        </n-form-item>
      </n-form>

      <template #action>
        <n-space>
          <n-button @click="() => (showModal = false)">取消</n-button>
          <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
        </n-space>
      </template>
    </n-modal>
  </n-card>
</template>

<script lang="ts" setup>
  import { h, reactive, ref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { createFeedback, deleteFeedback, getFeedbackList } from '@/api/feedback/feedback';
  import { columns } from './columns';
  import { PlusOutlined } from '@vicons/antd';
  import { type FormRules } from 'naive-ui';
  import { formatToDateTime } from '@/utils/dateUtil';

  const rules: FormRules = {
    feedbackText: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入地址',
    },
  };

  const formRef: any = ref(null);
  const actionRef = ref();

  const showModal = ref(false);
  const formBtnLoading = ref(false);
  const formParams = reactive({
    feedbackText: '',
  });

  const actionColumn = reactive({
    width: 150,
    title: '操作',
    key: 'action',
    fixed: 'right',
    align: 'center',
    render(record) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: '删除',
            onClick: handleDelete.bind(null, record),
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

  function addTable() {
    showModal.value = true;
  }

  const loadDataTable = async (res) => {
    const result = await getFeedbackList(res);
    const feedbackList = result.data;
    feedbackList.list.forEach((fb) => {
      fb.createdAt = formatToDateTime(new Date(fb.createdAt));
    });
    feedbackList.total = Math.ceil(feedbackList.total / feedbackList.pageSize);
    return feedbackList;
  };

  function reloadTable() {
    actionRef.value.reload();
  }

  function onCheckedRow(rowKeys) {
    console.log(rowKeys);
  }

  // 新建反馈
  const confirmForm = (e) => {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate(async (errors) => {
      if (!errors) {
        const { code, msg } = await createFeedback(formParams);
        if (code === 0) {
          window['$message'].success(msg);
          showModal.value = false;
          reloadTable();
        } else {
          window['$message'].error(msg);
        }
      } else {
        window['$message'].error('请填写完整信息');
      }
      formParams.feedbackText = '';
      formBtnLoading.value = false;
    });
  };

  const handleDelete = async (record: Recordable) => {
    const { code, msg } = await deleteFeedback({ ID: record.ID });
    if (code === 0) {
      window['$message'].success(msg);
    } else {
      window['$message'].error(msg);
    }
    await reloadTable();
  };
</script>

<style lang="less" scoped></style>
