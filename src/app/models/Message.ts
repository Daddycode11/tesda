import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { User } from './Users';

export interface Conversation {
  user: User | null;
  me: User | null;
  messages: Message[];
}
export interface Message {
  id: string;
  message: string;
  senderId: string;
  receiverId: string;
  seen: boolean;
  createdAt: Date;
}

export const MessageConverter = {
  toFirestore: (data: Message) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const data = snap.data() as Message;
    data.createdAt = (data.createdAt as any).toDate();
    return data;
  },
};
