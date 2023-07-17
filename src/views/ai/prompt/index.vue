<template>
  <div class="console">
    <!--导航卡片-->
    <div class="mt-4">
      <n-grid cols="1 s:2 m:3 l:8 xl:8 2xl:8" responsive="screen" :x-gap="16" :y-gap="8">
        <n-grid-item v-for="(item, index) in promptList" :key="index">
          <NCard content-style="padding-top: 0;" size="small" :bordered="false">
            <template #footer>
              <n-skeleton v-if="loading" size="medium" />
              <div class="cursor-pointer" v-else>
                <p class="flex justify-center">
                  <span>
                    <n-icon :size="item.size" class="flex-1" :color="item.color">
                      <component :is="item.icon" v-on="item.eventObject || {}" />
                    </n-icon>
                  </span>
                </p>
                <p class="flex justify-center">
                  <span>{{ item.title }}</span>
                </p>
              </div>
            </template>
          </NCard>
        </n-grid-item>
      </n-grid>
    </div>

    <!--访问量 | 流量趋势-->
    <VisitTab />
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import VisitTab from './components/VisiTab.vue';
  import { TagsOutlined } from '@vicons/antd';
  import { getCurrentUserPromptList } from '@/api/ai/prompt';

  const loading = ref(true);
  // 提示词列表
  const promptList = ref([]);
  onMounted(async () => {
    const { code, data } = await getCurrentUserPromptList({ page: 1, pageSize: 10 });
    if (code === 0) {
      promptList.value = data.list.map(({ name }) => ({
        icon: TagsOutlined,
        size: '32',
        title: name,
        color: '#ff85c0',
        eventObject: {
          click: () => {},
        },
      }));
    }
    loading.value = false;
  });
</script>

<style lang="less" scoped></style>
