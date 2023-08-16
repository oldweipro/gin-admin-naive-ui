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

    <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" title="新建密钥">
      <n-form
        :model="formParams"
        ref="formRef"
        label-placement="left"
        :label-width="80"
        class="py-4"
      >
        <n-form-item label="名字" path="skName">
          <n-input type="text" placeholder="名字" v-model:value="formParams.skName" />
        </n-form-item>
        <n-form-item label="过期" path="expire">
          <!-- <n-date-picker v-model:value="formParams.expire" type="datetime" clearable disabled />-->
          <n-input disabled value="无限制" />
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
  import {
    createSecretKey,
    deleteSecretKey,
    findSecretKey,
    getSecretKeyList,
  } from '@/api/platform/sk';
  import { columns } from './columns';
  import { PlusOutlined } from '@vicons/antd';
  import { formatToDateTime } from '@/utils/dateUtil';
  import { copyToClip } from '@/utils/copy';

  const formRef: any = ref(null);
  const actionRef = ref();

  const showModal = ref(false);
  const formBtnLoading = ref(false);
  const formParams = reactive({
    skName: '',
    expire: 0,
  });

  const actionColumn = reactive({
    width: 70,
    title: '操作',
    key: 'action',
    fixed: 'right',
    align: 'center',
    render(record) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: '复制',
            onClick: copySk.bind(null, record),
            // 根据业务控制是否显示 isShow 和 auth 是并且关系
            ifShow: () => {
              return true;
            },
            // 根据权限控制是否显示: 有权限，会显示，支持多个
            auth: ['basic_list'],
          },
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
    const result = await getSecretKeyList(res);
    const feedbackList = result.data;
    feedbackList.list.forEach((fb) => {
      fb.CreatedAt = formatToDateTime(new Date(fb.CreatedAt));
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

  // 新建sk
  const confirmForm = (e) => {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate(async (errors) => {
      if (!errors) {
        const { code, msg } = await createSecretKey(formParams);
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
      formParams.skName = '';
      formParams.expire = 0;
      formBtnLoading.value = false;
    });
  };

  const handleDelete = async (record: Recordable) => {
    const { code, msg } = await deleteSecretKey({ ID: record.ID });
    if (code === 0) {
      window['$message'].success(msg);
    } else {
      window['$message'].error(msg);
    }
    reloadTable();
  };

  const copySk = async (record: Recordable) => {
    const { code, msg, data } = await findSecretKey({ ID: record.ID });
    if (code === 0) {
      await copyToClip(data.sk);
      window['$message'].success('复制成功');
    } else {
      window['$message'].error(msg);
    }
  };
</script>

<style lang="less" scoped></style>
