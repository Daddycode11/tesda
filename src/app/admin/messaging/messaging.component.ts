import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Conversation, Message } from '../../models/Message';
import { User } from '../../models/Users';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  map,
  Observable,
  of,
  shareReplay,
} from 'rxjs';
import { MessagingService } from '../../services/messaging.service';
import { ToastrService } from '../../services/toastr.service';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  ɵInternalFormsSharedModule,
} from '@angular/forms';
import { ReversePipe } from './ReversePipe';

@Component({
  selector: 'app-messaging',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ReversePipe],
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.scss'], // ← fix typo: use `styleUrls` (plural)
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagingComponent implements OnInit {
  conversation$: Observable<Conversation[]> = combineLatest([
    this.authService.getAllUsers().pipe(shareReplay(1)),
    this.messagingService.getMyConversations().pipe(shareReplay(1)),
    this.authService.getCurrentUser().pipe(shareReplay(1)),
  ]).pipe(
    debounceTime(50),
    map(([users, messages, me]) => {
      if (!me) return [];
      const uid = me.id;

      const grouped = new Map<string, Message[]>();
      for (const msg of messages) {
        const otherId = msg.senderId === uid ? msg.receiverId : msg.senderId;
        if (!grouped.has(otherId)) grouped.set(otherId, []);
        grouped.get(otherId)!.push(msg);
      }

      // Create conversation objects
      const conversations = users
        .filter((u) => u.id !== uid)
        .map((user) => {
          const msgs = (grouped.get(user.id) ?? []).sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
          );

          return {
            user,
            me,
            messages: msgs,
          };
        });

      // Sort conversations by the latest message timestamp (most recent first)
      return conversations.sort((a, b) => {
        const latestA = a.messages[0]?.createdAt?.getTime() ?? 0;
        const latestB = b.messages[0]?.createdAt?.getTime() ?? 0;
        return latestB - latestA;
      });
    }),
    shareReplay(1)
  );

  private selectedUserId = new BehaviorSubject<string | null>(null);
  selectedUserId$ = this.selectedUserId.asObservable();
  selectedChat$: Observable<Conversation | null> = combineLatest([
    this.conversation$,
    this.selectedUserId$,
  ]).pipe(
    map(([conversations, selectedId]) => {
      if (!selectedId) return null;
      return conversations.find((c) => c.user?.id === selectedId) ?? null;
    })
  );
  constructor(
    private messagingService: MessagingService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {}
  messageText = new FormControl('', Validators.required);

  selectChat(chat: Conversation) {
    this.selectedUserId.next(chat.user?.id ?? '');
  }

  sendMessage() {
    const receiverId = this.selectedUserId.getValue() ?? '';

    const message: Message = {
      id: '',
      message: this.messageText.value ?? '',
      senderId: '',
      receiverId: receiverId,
      seen: false,
      createdAt: new Date(),
    };

    this.messagingService
      .sendMessage(message)
      .then(() => {
        this.toastr.showSuccess('Message sent!');
        this.messageText.patchValue('');
      })
      .catch((e) => this.toastr.showError(e?.message ?? 'Unknown Error'));
  }
  setConvo(user: User): Conversation {
    return {
      user: user,
      me: null,
      messages: [],
    };
  }
  get chatList(): Observable<Conversation[]> {
    return this.conversation$.pipe(
      map((conversations) =>
        conversations.filter((c) => c.messages && c.messages.length > 0)
      )
    );
  }
}
