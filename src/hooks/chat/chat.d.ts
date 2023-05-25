declare namespace Chat {
  interface Chat {
    dateTime: string;
    text: string;
    inversion?: boolean;
    error?: boolean;
    loading?: boolean;
  }

  interface History {
    title: string;
    isEdit: boolean;
    uuid: number;
  }

  interface ChatState {
    active: number | null;
    // // 加个uuid字段，为了点击不同的聊天窗口，聊天的内容是对应的
    // uuid: number | null,
    usingContext: boolean;
    history: History[];
    chat: { uuid: number; data: Chat[] }[];
  }

  interface ConversationResponse {
    conversationId: string;
    detail: {
      choices: { finish_reason: string; index: number; logprobs: any; text: string }[];
      created: number;
      id: string;
      model: string;
      object: string;
      usage: { completion_tokens: number; prompt_tokens: number; total_tokens: number };
    };
    id: string;
    parentMessageId: string;
    role: string;
    text: string;
  }
}
