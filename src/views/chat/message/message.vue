<script setup lang="ts">
  import { computed, ref } from 'vue';

  console.log('哈哈哈');
  interface Props {
    dateTime?: string;
    text?: string;
    inversion?: boolean;
    error?: boolean;
    loading?: boolean;
  }
  const props = defineProps<Props>();
  console.log(props);
  const asRawText = ref(props.inversion);
  const wrapClass = computed(() => {
    return [
      'text-wrap',
      'min-w-[20px]',
      'rounded-md',
      'px-3 py-2',
      props.inversion ? 'bg-[#d2f9d1]' : 'bg-[#f4f6f8]',
      props.inversion ? 'dark:bg-[#a1dc95]' : 'dark:bg-[#1e1e20]',
      props.inversion ? 'message-request' : 'message-reply',
      { 'text-red-500': props.error },
    ];
  });
</script>

<template>
  <div
    ref="messageRef"
    class="flex w-full mb-6 overflow-hidden"
    :class="[{ 'flex-row-reverse': inversion }]"
  >
    <div
      class="flex items-center justify-center flex-shrink-0 h-8 overflow-hidden rounded-full basis-8"
      :class="[inversion ? 'ml-2' : 'mr-2']"
    >
    </div>
    <div class="overflow-hidden text-sm" :class="[inversion ? 'items-end' : 'items-start']">
      <p class="text-xs text-[#b4bbc4]" :class="[inversion ? 'text-right' : 'text-left']">
        {{ dateTime }}
      </p>
      <div class="flex items-end gap-1 mt-2" :class="[inversion ? 'flex-row-reverse' : 'flex-row']">
        <div class="text-black" :class="wrapClass">
          <div ref="textRef" class="leading-relaxed break-words">
            <div v-if="!inversion">
              <div v-if="!asRawText" class="markdown-body" v-html="text"></div>
              <div v-else class="whitespace-pre-wrap" v-text="text"></div>
            </div>
            <div v-else class="whitespace-pre-wrap" v-text="text"></div>
            <template v-if="loading && !text">
              <span class="dark:text-white w-[4px] h-[20px] block animate-blink"></span>
            </template>
          </div>
        </div>
        <div class="flex flex-col">
          <button
            v-if="!inversion"
            class="mb-2 transition text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-300"
          >
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less"></style>
