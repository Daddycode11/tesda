import { QueryDocumentSnapshot } from '@angular/fire/firestore';

export interface Feedback {
  id: string;
  name: string;
  profile?: string | null;
  uid: string;
  sentiment: Sentiment;
  comment?: string;
  allowFollowUp: boolean;
  submittedAt: Date;
}

export enum Sentiment {
  VeryDissatisfied = 'Very Dissatisfied',
  Dissatisfied = 'Dissatisfied',
  Neutral = 'Neutral',
  Satisfied = 'Satisfied',
  VerySatisfied = 'Very Satisfied',
}

export const FeedbackConverter = {
  toFirestore: (data: Feedback) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const data = snap.data() as Feedback;
    data.submittedAt = (data.submittedAt as any).toDate();
    return data;
  },
};
