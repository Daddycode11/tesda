import { QueryDocumentSnapshot } from '@angular/fire/firestore';

export interface Requirements {
  id: string;
  title: string;
  description: string;
  items: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const RequirementConverter = {
  toFirestore: (data: Requirements) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const data = snap.data() as Requirements;
    data.createdAt = (data.createdAt as any).toDate();
    data.updatedAt = (data.updatedAt as any).toDate();
    return data;
  },
};
