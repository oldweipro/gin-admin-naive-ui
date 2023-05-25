import { defineStore } from 'pinia';
import { getCurrentUserConversationList, updateConversation } from '@/api/chat/chat';
export const useChatStore = defineStore('chat-store', {
  // 现在改造成从接口读取
  state: (): Chat.ChatState =>
    <Chat.ChatState>{
      active: 0,
      usingContext: true,
      history: [],
      chat: [{ uuid: 0, data: [] }],
    },

  getters: {
    getChatHistoryByCurrentActive(state: Chat.ChatState) {
      const index = state.history.findIndex((item) => item.uuid === state.active);
      if (index !== -1) {
        return state.history[index];
      }
      return null;
    },

    getChatByUuid(state: Chat.ChatState) {
      return () => {
        return state.chat.find((item) => item.uuid === state.active)?.data ?? [];
      };
    },
  },

  actions: {
    async loadData() {
      const chatState = await getCurrentUserConversationList();
      if (chatState.code === 0) {
        this.active = chatState.data.active;
        this.chat = chatState.data.chat;
        this.history = chatState.data.history;
        this.usingContext = chatState.data.usingContext;
      }
    },

    getChatByUuidAndIndex(uuid: number, index: number) {
      if (!uuid || uuid === 0) {
        if (this.chat.length) {
          return this.chat[0].data[index];
        }
        return null;
      }
      const chatIndex = this.chat.findIndex((item) => item.uuid === uuid);
      if (chatIndex !== -1) {
        return this.chat[chatIndex].data[index];
      }
      return null;
    },

    addChatByUuid(uuid: number, chat: Chat.Chat) {
      // console.log('新增聊天记录uuid: ', uuid, ' activeConversationId: ')
      if (!uuid || uuid === 0) {
        console.log('【新增】这说明没有会话,uuid为0');
      }

      const index = this.chat.findIndex((item) => item.uuid === uuid);
      if (index !== -1) {
        this.chat[index].data.push(chat);
        // TODO 下面注释的代码是应该对一下后端接口，修改聊天室名字
        // if (this.history[index].title === '新聊天')
        //   this.history[index].title = chat.text
      }
    },

    updateChatByUuid(uuid: number, index: number, chat: Chat.Chat) {
      if (!uuid || uuid === 0) {
        // if (this.chat.length) {
        //   this.chat[0].data[index] = chat
        // }
        console.log('【更新】这说明没有会话,uuid为0');
        return;
      }

      const chatIndex = this.chat.findIndex((item) => item.uuid === uuid);
      if (chatIndex !== -1) {
        this.chat[chatIndex].data[index] = chat;
      }
    },

    updateChatSomeByUuid(uuid: number, index: number, chat: Partial<Chat.Chat>) {
      if (!uuid || uuid === 0) {
        if (this.chat.length) {
          this.chat[0].data[index] = { ...this.chat[0].data[index], ...chat };
        }
        return;
      }

      const chatIndex = this.chat.findIndex((item) => item.uuid === uuid);
      if (chatIndex !== -1) {
        this.chat[chatIndex].data[index] = { ...this.chat[chatIndex].data[index], ...chat };
      }
    },

    deleteChatByUuid(uuid: number, index: number) {
      if (!uuid || uuid === 0) {
        if (this.chat.length) {
          this.chat[0].data.splice(index, 1);
        }
        return;
      }

      const chatIndex = this.chat.findIndex((item) => item.uuid === uuid);
      if (chatIndex !== -1) {
        this.chat[chatIndex].data.splice(index, 1);
      }
    },

    clearChatByUuid(uuid: number) {
      if (!uuid || uuid === 0) {
        if (this.chat.length) {
          this.chat[0].data = [];
        }
        return;
      }

      const index = this.chat.findIndex((item) => item.uuid === uuid);
      if (index !== -1) {
        this.chat[index].data = [];
      }
    },

    // 线上存储
    recordStateRemote(history: Chat.History) {
      const conversation = {
        id: history.uuid,
        conversationName: history.title,
      };
      updateConversation(conversation).then((r) => console.log(r.code));
    },
  },
});
