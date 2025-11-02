import { QueryDocumentSnapshot } from '@angular/fire/firestore';

export interface Announcement {
  id: string;
  image: string;
  type: 'announcement' | 'news';
  title: string;
  summary: string;
  content: string;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

export const AnnouncementConverter = {
  toFirestore: (data: Announcement) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const data = snap.data() as Announcement;
    data.createdAt = (data.createdAt as any).toDate();
    data.updatedAt = (data.updatedAt as any).toDate();
    return data;
  },
};
