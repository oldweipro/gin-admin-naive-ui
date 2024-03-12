<template>
  <n-space vertical size="large">
    <n-layout>
      <n-layout-content
        ref="contentRef"
        content-style="padding: 8px;"
        :native-scrollbar="false"
        style="height: calc(100vh - 132px)"
      >
        <div class="flex flex-col w-full h-full">
          <main class="flex-1 overflow-hidden">
            <div id="scrollRef" ref="scrollRef" class="h-full overflow-hidden overflow-y-auto">
              <div
                id="image-wrapper"
                class="w-full max-w-screen-xl m-auto"
                :class="[isMobile ? 'p-2' : 'p-4']"
              >
                <template v-if="!dataSources.length">
                  <div class="flex items-center justify-center mt-4 text-center text-neutral-300">
                    <SvgIcon icon="ri:bubble-chart-fill" class="mr-2 text-3xl" />
                    <span>Aha~</span>
                  </div>
                </template>
                <template v-else>
                  <div>
                    <Message
                      v-for="(item, index) of dataSources"
                      :key="index"
                      :date-time="item.dateTime"
                      :text="item.text"
                      :inversion="item.inversion"
                      :error="item.error"
                      :loading="item.loading"
                      @regenerate="onRegenerate(index)"
                      @delete="handleDelete(index)"
                    />
                    <div class="sticky bottom-0 left-0 flex justify-center">
                      <NButton v-if="loading" type="warning" @click="handleStop">
                        <template #icon>
                          <SvgIcon icon="ri:stop-circle-line" />
                        </template>
                        Stop Responding
                      </NButton>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </main>
        </div>
      </n-layout-content>
      <n-layout-footer bordered>
        <footer :class="footerClass" style="padding: 8px">
          <div class="w-full max-w-screen-xl m-auto">
            <div class="flex items-center justify-between space-x-2">
              <HoverButton @click="handleClear">
                <span class="text-xl text-[#4f555e]">
                  <SvgIcon icon="ri:delete-bin-line" />
                </span>
              </HoverButton>
              <HoverButton v-if="!isMobile" @click="handleExport">
                <span class="text-xl text-[#4f555e]">
                  <SvgIcon icon="ri:download-2-line" />
                </span>
              </HoverButton>
              <NAutoComplete
                v-model:value="prompt"
                :options="searchOptions"
                :on-select="onSelect"
                :render-label="renderOption"
                clear-after-select
              >
                <template #default="{ handleInput, handleBlur, handleFocus }">
                  <NInput
                    ref="inputRef"
                    v-model:value="prompt"
                    type="textarea"
                    :placeholder="placeholder"
                    :autosize="{ minRows: 1, maxRows: isMobile ? 4 : 8 }"
                    @input="handleInput"
                    @focus="handleFocus"
                    @blur="handleBlur"
                    @keypress="handleEnter"
                  />
                </template>
              </NAutoComplete>
              <NButton type="primary" :disabled="buttonDisabled" @click="handleSubmit">
                <template #icon>
                  <span class="dark:text-black">
                    <SvgIcon icon="ri:send-plane-fill" />
                  </span>
                </template>
              </NButton>
            </div>
          </div>
        </footer>
      </n-layout-footer>
    </n-layout>
  </n-space>
</template>

<script lang="ts" setup>
  import type { Ref } from 'vue';
  import { computed, h, onMounted, onUnmounted, ref } from 'vue';
  import { NTag, useDialog, useMessage } from 'naive-ui';
  import html2canvas from 'html2canvas';
  import { useScroll } from '@/hooks/chat/useScroll';
  import { useChat } from '@/hooks/chat/useChat';
  import HoverButton from '@/components/HoverButton/index.vue';
  import SvgIcon from '@/components/SvgIcon/index.vue';
  import { useBasicLayout } from '@/hooks/chat/useBasicLayout';
  import { useChatStore } from '@/hooks/chat';
  import { chatCompletions, createConversation } from '@/api/ai/chat';
  import Message from '@/views/ai/chat/message/message.vue';
  import { getCurrentUserPromptList } from '@/api/ai/prompt';

  let controller = new AbortController();

  const openLongReply = import.meta.env.VITE_GLOB_OPEN_LONG_REPLY === 'true';

  const dialog = useDialog();
  const ms = useMessage();

  const { isMobile } = useBasicLayout();
  const { addChat, updateChat, updateChatSome, getChatByUuidAndIndex } = useChat();
  const { scrollRef, contentRef, scrollToBottom, scrollToBottomIfAtBottom } = useScroll();
  const chatStore = useChatStore();
  chatStore.loadData({ conversationType: 0 });

  const dataSources = computed(() => {
    // 获取当前聊天窗口的数据
    scrollToBottom();
    return chatStore.getChatByUuid();
  });
  // console.log(dataSources.value)
  const prompt = ref<string>('');
  const promptId = ref<number>(0);
  const loading = ref<boolean>(false);
  const inputRef = ref<Ref | null>(null);

  onMounted(async () => {
    const { code, data } = await getCurrentUserPromptList({ page: 1, pageSize: 10 });
    if (code === 0) {
      promptTemplate.value = data.list.map(({ id, name }) => ({
        key: name,
        value: id.toString(),
      }));
    }
  });
  // 选择prompt
  // const selectedPrompt = ref('');
  const promptTemplate = ref([]);
  // 未知原因刷新页面，loading 状态不会重置，手动重置
  dataSources.value.forEach((item, index) => {
    if (item.loading) {
      updateChatSome(chatStore.active!, index, { loading: false });
    }
  });

  function handleSubmit() {
    onConversation();
  }

  async function onConversation() {
    let message = prompt.value;

    if (loading.value) {
      return;
    }

    if (!message || message.trim() === '') {
      return;
    }

    controller = new AbortController();

    // 用户输入的聊天
    addChat(chatStore.active!, {
      dateTime: new Date().toLocaleString(),
      text: message,
      inversion: true,
      error: false,
    });
    await scrollToBottom();

    loading.value = true;
    prompt.value = '';

    // AI回答
    addChat(chatStore.active!, {
      dateTime: new Date().toLocaleString(),
      text: '',
      loading: true,
      inversion: false,
      error: false,
    });
    await scrollToBottom();

    try {
      // 定义接口
      const fetchChatAPIOnce = async () => {
        // console.log('发起请求时的会话ID: ', chatStore.active!)
        await chatCompletions({
          prompt: message,
          promptId: promptId.value,
          standardAlone: promptId.value > 0 ? 1 : 0,
          conversationId: chatStore.active!,
          signal: controller.signal,
          onDownloadProgress: ({ event }) => {
            let lastText = '';
            const { responseText } = event.target;
            if (responseText.includes('"code":')) {
              // TODO 应该把返回的消息显示出来
              lastText = JSON.parse(responseText).msg;
              return;
            }
            // 处理AI回答
            const data = responseText
              .split('data:')
              .filter((line: string) => line.length > 0)
              .map((line: string) => line.replace(/\n+$/, ''));
            data.forEach((contentText: string) => {
              const parse = JSON.parse(contentText);
              try {
                lastText += parse.content;
                updateChat(chatStore.active!, dataSources.value.length - 1, {
                  dateTime: new Date().toLocaleString(),
                  text: lastText,
                  inversion: false,
                  error: false,
                  loading: true,
                });
                scrollToBottomIfAtBottom();
              } catch (error) {
                //
              }
            });
          },
        });

        updateChatSome(chatStore.active!, dataSources.value.length - 1, { loading: false });
      };

      // 调用接口
      await fetchChatAPIOnce();
    } catch (error: any) {
      // TODO 这是处理错误的 开始========================
      const errorMessage = error?.message ?? '系统错误';

      if (error.message === 'canceled') {
        updateChatSome(chatStore.active!, dataSources.value.length - 1, {
          loading: false,
        });
        await scrollToBottomIfAtBottom();
        return;
      }

      const currentChat = getChatByUuidAndIndex(chatStore.active!, dataSources.value.length - 1);

      if (currentChat?.text && currentChat.text !== '') {
        updateChatSome(chatStore.active!, dataSources.value.length - 1, {
          text: `${currentChat.text}\n[${errorMessage}]`,
          error: false,
          loading: false,
        });
        return;
      }

      updateChat(chatStore.active!, dataSources.value.length - 1, {
        dateTime: new Date().toLocaleString(),
        text: errorMessage,
        inversion: false,
        error: true,
        loading: false,
      });
      await scrollToBottomIfAtBottom();
      // TODO 这是处理错误的 结束========================
    } finally {
      loading.value = false;
    }
  }

  // TODO 重新生成 开始============================
  async function onRegenerate(index: number) {
    if (loading.value) {
      return;
    }

    controller = new AbortController();

    loading.value = true;

    // updateChat(
    //   chatStore.active!,
    //   index,
    //   {
    //     dateTime: new Date().toLocaleString(),
    //     text: '',
    //     inversion: false,
    //     error: false,
    //     loading: true,
    //   },
    // )

    try {
      let lastText = '';
      let textLength = 1;
      const fetchChatAPIOnce = async () => {
        await chatCompletions({
          prompt: 'message',
          promptId: promptId.value,
          standardAlone: promptId.value > 0 ? 1 : 0,
          conversationId: chatStore.active as number,
          // options,
          signal: controller.signal,
          onDownloadProgress: ({ event }) => {
            const xhr = event.target;
            const { responseText } = xhr;

            const textArray = responseText.split('\n');

            for (let i = textLength; i < textArray.length; i++) {
              try {
                const data = JSON.parse(textArray[i]);
                const contentText = data.content;
                lastText += contentText ?? '';
                // console.log(contentText)
                // 添加openai返回的信息
                updateChat(chatStore.active!, dataSources.value.length - 1, {
                  dateTime: new Date().toLocaleString(),
                  text: lastText,
                  inversion: false,
                  error: false,
                  loading: true,
                });
                if (openLongReply && data.detail.choices[0].finish_reason === 'length') {
                  return fetchChatAPIOnce();
                }

                scrollToBottomIfAtBottom();
              } catch (error) {
                //
              }
            }
            textLength = textArray.length - 1;
          },
        });
        updateChatSome(chatStore.active!, index, { loading: false });
      };
      await fetchChatAPIOnce();
    } catch (error: any) {
      if (error.message === 'canceled') {
        updateChatSome(chatStore.active!, index, {
          loading: false,
        });
        return;
      }

      const errorMessage = error?.message ?? '系统错误';

      updateChat(chatStore.active!, index, {
        dateTime: new Date().toLocaleString(),
        text: errorMessage,
        inversion: false,
        error: true,
        loading: false,
      });
    } finally {
      loading.value = false;
    }
  }

  // TODO 重新生成 结束============================

  function handleExport() {
    if (loading.value) {
      return;
    }

    const d = dialog.warning({
      title: '导出图片',
      content: '确认导出图片',
      positiveText: '是',
      negativeText: '否',
      onPositiveClick: async () => {
        try {
          d.loading = true;
          const ele = document.getElementById('image-wrapper');
          const canvas = await html2canvas(ele as HTMLDivElement, {
            useCORS: true,
          });
          const imgUrl = canvas.toDataURL('image/png');
          const tempLink = document.createElement('a');
          tempLink.style.display = 'none';
          tempLink.href = imgUrl;
          tempLink.setAttribute('download', 'ai-shot.png');
          if (typeof tempLink.download === 'undefined') {
            tempLink.setAttribute('target', '_blank');
          }

          document.body.appendChild(tempLink);
          tempLink.click();
          document.body.removeChild(tempLink);
          window.URL.revokeObjectURL(imgUrl);
          d.loading = false;
          ms.success('导出成功');
          Promise.resolve();
        } catch (error: any) {
          ms.error('导出失败');
        } finally {
          d.loading = false;
        }
      },
    });
  }

  function handleDelete(index: number) {
    if (loading.value) {
      return;
    }

    dialog.warning({
      title: '删除消息',
      content: '确认删除消息',
      positiveText: '是',
      negativeText: '否',
      onPositiveClick: () => {
        chatStore.deleteChatByUuid(chatStore.active!, index);
      },
    });
    promptId.value = 0;
  }

  function handleClear() {
    if (loading.value) {
      return;
    }
    dialog.warning({
      title: '清除聊天',
      content: '确认清除聊天',
      positiveText: '是',
      negativeText: '否',
      onPositiveClick: async () => {
        chatStore.clearChatByUuid(chatStore.active!);
        // 创建新的聊天
        await createConversation({
          conversationName: '新聊天',
          conversationType: 0,
        });
        await chatStore.loadData({ conversationType: 0 });
      },
    });
    promptId.value = 0;
  }

  function handleEnter(event: KeyboardEvent) {
    if (!isMobile.value) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSubmit();
      }
    } else {
      if (event.key === 'Enter' && event.ctrlKey) {
        event.preventDefault();
        handleSubmit();
      }
    }
  }

  function handleStop() {
    if (loading.value) {
      controller.abort();
      loading.value = false;
    }
  }

  // 可优化部分
  // 搜索选项计算，这里使用value作为索引项，所以当出现重复value时渲染异常(多项同时出现选中效果)
  // 理想状态下其实应该是key作为索引项,但官方的renderOption会出现问题，所以就需要value反renderLabel实现
  const searchOptions = computed(() => {
    return promptTemplate.value
      .filter((item: { key: string }) => item.key.includes(prompt.value))
      .map((obj: { value: any }) => {
        return {
          label: obj.value,
          value: obj.value,
        };
      });
  });

  // value反渲染key
  const renderOption = (option: { label: string }) => {
    for (const i of promptTemplate.value) {
      if (i.value === option.label) {
        return [h(NTag, { size: 'small', type: 'info' }, { default: () => '快捷键' }), ' ', i.key];
      }
    }
    return [];
  };

  const onSelect = (value: string) => {
    // 清空输入框内容
    promptId.value = parseInt(value);
  };

  const placeholder = computed(() => {
    if (isMobile.value) {
      return '请输入您的问题';
    }
    return '请输入您的问题';
  });

  const buttonDisabled = computed(() => {
    return loading.value;
  });

  const footerClass = computed(() => {
    let classes = ['p-4'];
    if (isMobile.value) {
      classes = ['sticky', 'left-0', 'bottom-0', 'right-0', 'p-2', 'pr-3', 'overflow-hidden'];
    }
    return classes;
  });

  onMounted(() => {
    if (inputRef.value && !isMobile.value) {
      inputRef.value?.focus();
    }
  });

  onUnmounted(() => {
    if (loading.value) {
      controller.abort();
    }
  });
</script>
<style lang="less"></style>
