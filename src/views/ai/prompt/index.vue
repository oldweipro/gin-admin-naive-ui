<template>
  <div class="console">
    <!--导航卡片-->
    <div class="mt-4">
      <n-grid cols="1 s:2 m:3 l:4 xl:4 2xl:4" responsive="screen" :x-gap="12" :y-gap="8">
        <n-grid-item v-for="(item, index) in promptList" :key="index">
          <NCard
            :title="item.title"
            :segmented="{ content: true, footer: true }"
            content-style="padding-top: 0;"
            size="small"
            :bordered="false"
            @click="console.log(item)"
          >
            <template #header-extra>
              <n-tag type="success">{{ item.shortcutKey }}</n-tag>
            </template>
            <div class="py-1 px-1 flex justify-between">
              <div class="text-sn">
                <n-skeleton v-if="loading" :width="100" size="medium" />
                <n-ellipsis line-clamp="2" v-else>
                  {{ item.content }}
                </n-ellipsis>
              </div>
            </div>
            <template #footer>
              <div class="flex justify-between">
                <n-skeleton v-if="loading" text :repeat="2" />
                <template v-else>
                  <div class="text-sn">
                    <n-gradient-text
                      gradient="linear-gradient(90deg, red 0%, green 50%, blue 100%)"
                    >
                      {{ item.description }}
                    </n-gradient-text>
                  </div>
                </template>
              </div>
            </template>
          </NCard>
        </n-grid-item>
      </n-grid>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { getCurrentUserPromptList } from '@/api/ai/prompt';

  const loading = ref(true);
  // 提示词列表
  const promptList = ref([]);
  onMounted(async () => {
    const { code, data } = await getCurrentUserPromptList({ page: 1, pageSize: 10 });
    if (code === 0) {
      promptList.value = data.list.map(({ ID, name, shortcutKey, description, content }) => ({
        title: name,
        description: description,
        shortcutKey: shortcutKey,
        content: content,
        id: ID,
      }));
    }
    loading.value = false;
  });
</script>

<style lang="less" scoped></style>
