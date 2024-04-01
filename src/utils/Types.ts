export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  content: string;
  sentAt: Date;
}

export interface onlineData {
  userId: string;
  userName: string;
}
