import { Injectable } from '@angular/core';
import { Feedback, FeedbackConverter, Sentiment } from '../models/Feedback';
import { from, map, Observable } from 'rxjs';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';

import { UserConverter } from '../models/Users';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  private readonly FEEDBACK_COLLECTION = 'feedbacks';
  constructor(private firestore: Firestore, private auth: Auth) {}

  async createFeedback(
    sentiment: Sentiment,
    comment?: string,
    allowFollowUp: boolean = true
  ): Promise<void> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      throw new Error('Log in first to add feedback');
    }

    const userSnap = await getDoc(
      doc(this.firestore, 'users', uid).withConverter(UserConverter)
    );
    const user = userSnap.data();

    if (!user) {
      throw new Error('User profile not found');
    }

    const ref = doc(collection(this.firestore, this.FEEDBACK_COLLECTION));
    const id = ref.id;

    const feedback: Feedback = {
      id,
      uid,
      name: user.name,
      profile: user.profile,
      sentiment,
      comment,
      allowFollowUp,
      submittedAt: new Date(),
    };

    await setDoc(ref.withConverter(FeedbackConverter), feedback);
  }

  async hasFeedback(uid: string): Promise<boolean> {
    const feedbackQuery = query(
      collection(this.firestore, this.FEEDBACK_COLLECTION).withConverter(
        FeedbackConverter
      ),
      where('uid', '==', uid)
    );

    const snapshot = await getDocs(feedbackQuery);

    if (snapshot.empty) return false;

    const feedback = snapshot.docs[0].data();

    if (!feedback.allowFollowUp) return true;

    const now = new Date();
    const submittedAt = feedback.submittedAt;
    const daysSince =
      (now.getTime() - submittedAt.getTime()) / (1000 * 60 * 60 * 24);

    return daysSince <= 7 ? false : true;
  }

  getAllFeedbacks(): Observable<Feedback[]> {
    const feedbackRef = query(
      collection(this.firestore, this.FEEDBACK_COLLECTION).withConverter(
        FeedbackConverter
      ),
      orderBy('submittedAt', 'desc')
    );
    return collectionData(feedbackRef);
  }
}
