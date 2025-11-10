import { QueryDocumentSnapshot } from '@angular/fire/firestore';

export interface Schedule {
  id: string;
  date: string; // 08/17/2000
  time: string; //11:30 AM
  slots: number;
  createdAt: Date;
  updatedAt: Date;
}

export const ScheduleConverter = {
  toFirestore: (data: Schedule) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const data = snap.data() as Schedule;
    data.createdAt = (data.createdAt as any).toDate();
    data.updatedAt = (data.updatedAt as any).toDate();
    return data;
  },
};
