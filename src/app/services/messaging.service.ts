import { Injectable } from '@angular/core';
import { Conversation, Message, MessageConverter } from '../models/Message';
import {
  collection,
  collectionData,
  doc,
  FieldValue,
  Firestore,
  getDoc,
  getDocs,
  or,
  orderBy,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { combineLatest, from, map, Observable, of, switchMap } from 'rxjs';
import { UserConverter } from '../models/Users';

@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  private readonly MESSAGES_COLLECTION = 'messages';
  constructor(private firestore: Firestore, private auth: Auth) {}

  sendMessage(message: Message) {
    const messageRef = doc(
      collection(this.firestore, this.MESSAGES_COLLECTION).withConverter(
        MessageConverter
      )
    );
    message.id = messageRef.id;
    message.senderId = this.auth.currentUser?.uid ?? '';
    return setDoc(messageRef, message);
  }
  getMyConversations(): Observable<Message[]> {
    const uid = this.auth.currentUser?.uid;
    const messagesRef = collection(
      this.firestore,
      this.MESSAGES_COLLECTION
    ).withConverter(MessageConverter);

    const messagesQuery = query(
      messagesRef,
      or(where('senderId', '==', uid), where('receiverId', '==', uid)),
      orderBy('createdAt', 'desc')
    );

    return collectionData(messagesQuery);
  }

  getUnseenMessages(uid: string): Observable<Message[]> {
    const messagesRef = collection(
      this.firestore,
      this.MESSAGES_COLLECTION
    ).withConverter(MessageConverter);

    const q = query(
      messagesRef,
      where('receiverId', '==', uid),
      where('seen', '==', false),
      orderBy('createdAt', 'desc')
    );

    return collectionData(q, { idField: 'id' }) as Observable<Message[]>;
  }
  getGroupedUnseenMessages(uid: string): Observable<UnSeenMessages[]> {
    return this.getUnseenMessages(uid).pipe(
      map((messages) => {
        const groups: { [senderId: string]: Message[] } = {};

        messages.forEach((msg) => {
          if (!groups[msg.senderId]) {
            groups[msg.senderId] = [];
          }
          groups[msg.senderId].push(msg);
        });

        return Object.keys(groups).map((senderId) => ({
          senderId,
          messages: groups[senderId],
          count: groups[senderId].length,
        }));
      })
    );
  }
}

export interface UnSeenMessages {
  senderId: string;
  messages: Message[];
  count: number;
}
