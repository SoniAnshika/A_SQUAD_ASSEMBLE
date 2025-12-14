export type EndConversationPayload = {
  message: string;
  sessionId: string;
  conversationEnded: boolean;
};

export function createEndConversationPayload(
  sessionId: string
): EndConversationPayload {
  return {
    message: "User ended the conversation",
    sessionId,
    conversationEnded: true,
  };
}