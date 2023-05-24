<template>
  <n-space vertical>
    <n-layout>
      <n-layout-header bordered>
        大语言模型
        <n-menu mode="horizontal" :options="menuOptions" @update:value="formSubmit" />
      </n-layout-header>
      <n-layout has-sider>
        <n-layout-sider
          bordered
          show-trigger
          collapse-mode="width"
          :collapsed-width="64"
          :width="240"
          :native-scrollbar="false"
          style="max-height: calc(100vh - 196px)"
        >
          <n-menu
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="menuOptions"
            @update:value="formSubmit"
          />
        </n-layout-sider>
        <n-layout-content
          ref="contentRef"
          content-style="padding: 24px;"
          :native-scrollbar="false"
          style="max-height: calc(100vh - 196px)"
        >
          <n-h2>讲个笑话</n-h2>
          <n-h2>飞机制造过程</n-h2>
          <n-h2>为什么会出现声明</n-h2>
          <n-h2>恐龙为什么灭绝</n-h2>
          <n-h2>咖啡为什么是苦的</n-h2>
          <n-h2>如何当好老板</n-h2>
          <n-h2>怎样成为老板</n-h2>
          <n-h2>职场中如何晋升最快</n-h2>
          <n-h2>世界上最高的山峰</n-h2>
          <n-h2>世界有多少人口</n-h2>
          <n-h2>如何建立正确的人生观</n-h2>
          <n-h2>海淀桥在哪里</n-h2>
          <n-h2>海洋面积是多少</n-h2>
          <n-h2>陆地面积是多少</n-h2>
          <n-h2>泸定桥在哪里</n-h2>
          <n-h2>云台山在哪</n-h2>
          <n-h2>介绍一下河南</n-h2>
        </n-layout-content>
      </n-layout>
      <n-layout-footer bordered>
        <n-auto-complete
          v-model:value="valueRef"
          :options="options"
          placeholder="输入 a 显示菜单"
          :get-show="getShow"
        />
      </n-layout-footer>
    </n-layout>
  </n-space>
</template>

<script lang="ts">
  import { h, defineComponent, Component, ref, computed } from 'vue';
  import { NIcon } from 'naive-ui';
  import {
    BookOutline as BookIcon,
    PersonOutline as PersonIcon,
    WineOutline as WineIcon,
  } from '@vicons/ionicons5';

  function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) });
  }

  const menuOptions = [
    {
      label: 'ChatGPT',
      key: 'hear-the-wind-sing',
      icon: renderIcon(BookIcon),
    },
    {
      label: '科大讯飞',
      key: 'pinball-1973',
      icon: renderIcon(BookIcon),
      disabled: false,
      children: [
        {
          label: '鼠',
          key: 'rat',
        },
      ],
    },
    {
      label: '通义千问',
      key: 'a-wild-sheep-chase',
      disabled: true,
      icon: renderIcon(BookIcon),
    },
    {
      label: '其他',
      key: 'dance-dance-dance',
      icon: renderIcon(BookIcon),
      children: [
        {
          type: 'group',
          label: '人物',
          key: 'people',
          children: [
            {
              label: '叙事者',
              key: 'narrator',
              icon: renderIcon(PersonIcon),
            },
            {
              label: '羊男',
              key: 'sheep-man',
              icon: renderIcon(PersonIcon),
            },
          ],
        },
        {
          label: '饮品',
          key: 'beverage',
          icon: renderIcon(WineIcon),
          children: [
            {
              label: '威士忌',
              key: 'whisky',
            },
          ],
        },
        {
          label: '食物',
          key: 'food',
          children: [
            {
              label: '三明治',
              key: 'sandwich',
            },
          ],
        },
        {
          label: '过去增多，未来减少',
          key: 'the-past-increases-the-future-recedes',
        },
      ],
    },
  ];

  export default defineComponent({
    setup() {
      const valueRef = ref('');
      function formSubmit(key, item) {
        console.log(key);
        console.log(item);
      }
      return {
        menuOptions,
        formSubmit,
        valueRef,
        options: computed(() => {
          return ['@gmail.com', '@163.com', '@qq.com'].map((suffix) => {
            const prefix = valueRef.value.split('@')[0];
            return {
              label: prefix + suffix,
              value: prefix + suffix,
            };
          });
        }),
        getShow: (value: string) => {
          if (value === 'a') {
            return true;
          }
          return false;
        },
      };
    },
  });
</script>
<style lang="less"></style>
