import { QueryDocumentSnapshot } from '@angular/fire/firestore';

export interface Comment {
  /** Unique identifier for the comment */
  id: string;
  /** ID of the user who posted the comment */
  newsId: string;
  /** ID of the user who posted the comment */
  uid: string;

  /** Display name of the commenter */
  name: string;

  /** Profile image URL */
  profile: string;

  /** Text content of the comment */
  message: string;

  /** Date the comment was created */
  createdAt: Date;

  /** Users who upvoted (list of UIDs) */
  upvotes: string[];

  /** Users who downvoted (list of UIDs) */
  downvotes: string[];

  /** Array of nested replies */
  replies?: Reply[];
}

export interface Reply {
  id: string;
  uid: string;
  name: string;
  profile: string;
  message: string;
  createdAt: Date;
  upvotes: string[];
  downvotes: string[];
}

export const CommentConverter = {
  toFirestore: (data: Comment) => data,

  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const data = snap.data() as Comment;

    data.createdAt = (data.createdAt as any).toDate();

    // ✅ Convert createdAt inside replies (if any)
    if (data.replies && Array.isArray(data.replies)) {
      data.replies = data.replies.map((reply: Reply) => {
        if (reply.createdAt && (reply.createdAt as any).toDate) {
          reply.createdAt = (reply.createdAt as any).toDate();
        }
        return reply;
      });
    }

    return data;
  },
};
