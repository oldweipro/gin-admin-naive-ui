<template>
  <n-space vertical>
    <n-layout>
      <n-layout has-sider>
        <n-layout-sider
          bordered
          show-trigger
          collapse-mode="width"
          :collapsed-width="64"
          :width="240"
          :native-scrollbar="false"
          style="height: calc(100vh - 124px)"
        >
          <n-menu
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="menuOptions"
            @update:value="formSubmit"
          />
        </n-layout-sider>
        <n-layout>
          <n-layout-content
            ref="contentRef"
            content-style="padding: 24px;"
            :native-scrollbar="false"
            style="height: calc(100vh - 154px)"
          >
            <message date-time="2023-05-24 12:00:22" text="你好世界" inversion="false" />
          </n-layout-content>
          <n-layout-footer bordered>
            <n-auto-complete
              v-model:value="valueRef"
              :options="options"
              placeholder="输入 / 显示菜单"
              :get-show="getShow"
            />
          </n-layout-footer>
        </n-layout>
      </n-layout>
    </n-layout>
  </n-space>
</template>

<script lang="ts" setup>
  import { h, Component, ref, computed } from 'vue';
  import { NIcon } from 'naive-ui';
  import { BookOutline as BookIcon } from '@vicons/ionicons5';
  import { getCurrentUserConversationList } from '@/api/chat/chat';
  import Message from '@/views/chat/message/message.vue';

  function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) });
  }
  const menuOptions = ref([]);
  const valueRef = ref('');
  const formSubmit = (key, item) => {
    console.log(key);
    console.log(item);
  };
  const loadData = async () => {
    const { data } = await getCurrentUserConversationList();
    data.chatList.forEach((element) => {
      element.icon = renderIcon(BookIcon);
    });
    menuOptions.value = data.chatList;
  };
  loadData();
  const options = computed(() => {
    return ['@gmail.com', '@163.com', '@qq.com'].map((suffix) => {
      const prefix = valueRef.value.split('@')[0];
      return {
        label: prefix + suffix,
        value: prefix + suffix,
      };
    });
  });
  const getShow = (value: string) => {
    return value === '/';
  };
</script>
<style lang="less"></style>
