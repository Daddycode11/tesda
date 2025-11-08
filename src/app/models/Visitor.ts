import { QueryDocumentSnapshot } from '@angular/fire/firestore';

//this is like visitory log if someone logged in this is trigger once daily per user to be save
export interface Visitor {
  id: string;
  loggedAt: Date;
  uid: string;
}

export const VisitorConverter = {
  toFirestore: (data: Visitor) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const data = snap.data() as Visitor;
    data.loggedAt = (data.loggedAt as any).toDate();
    return data;
  },
};
