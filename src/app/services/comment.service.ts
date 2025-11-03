import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  CollectionReference,
  doc,
  DocumentData,
  Firestore,
  getDoc,
  orderBy,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Comment, CommentConverter, Reply } from '../models/Comment';
import { Auth } from '@angular/fire/auth';
import { UserConverter } from '../models/Users';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly COMMENTS_COLLECTION = 'comments';
  constructor(private firestore: Firestore, private auth: Auth) {}

  /**
   * @param id - Announcement ID (e.g., newsId or announcementId)
   * @returns Observable<Comment[]> - Realtime comment updates
   */
  getAll(id: string): Observable<Comment[]> {
    const ref = collection(
      this.firestore,
      this.COMMENTS_COLLECTION
    ).withConverter(CommentConverter);

    const q = query(
      ref,
      where('newsId', '==', id),
      orderBy('createdAt', 'desc') // sort by latest comment
    );

    return collectionData(q, { idField: 'id' }) as Observable<Comment[]>;
  }

  /**
   * Adds a comment to a specific announcement or news item
   * @param id - The announcement/news ID
   * @param message - The comment message
   */
  async addComment(id: string, message: string): Promise<void> {
    try {
      const userAuth = this.auth.currentUser;
      if (!userAuth) {
        throw new Error('Login first before you comment');
      }

      // 🔹 Fetch additional user data from Firestore if needed
      const userDocRef = doc(
        this.firestore,
        'users',
        userAuth.uid
      ).withConverter(UserConverter);
      const userSnap = await getDoc(userDocRef);
      const userData = userSnap.exists() ? userSnap.data() : null;
      if (userData === null) {
        throw new Error('Invalid User');
      }
      // 🔹 Generate Firestore document reference to get an ID
      const ref = doc(collection(this.firestore, this.COMMENTS_COLLECTION));
      const comment: Comment = {
        id: ref.id,
        uid: userAuth.uid,
        name: userData.name,
        profile: userData.profile ?? '',
        message: message,
        createdAt: new Date(),
        upvotes: [],
        downvotes: [],
        replies: [],
        newsId: id,
      };

      await setDoc(ref, comment);

      console.log('✅ Comment added successfully with ID:', ref.id);
    } catch (e) {
      console.error('❌ Failed to add comment:', e);
      throw e;
    }
  }
}
