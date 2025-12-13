import { ChatMessage } from "./conversations";

const memoryStore = new Map<string, ChatMessage[]>();

export function getConversation(sessionId: string) {
  return memoryStore.get(sessionId) || [];
}

export function saveMessage(sessionId: string, message: ChatMessage) {
  const history = memoryStore.get(sessionId) || [];
  history.push(message);
  memoryStore.set(sessionId, history.slice(-10)); // keep last 10 messages
}