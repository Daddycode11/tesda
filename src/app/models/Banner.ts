import { QueryDocumentSnapshot } from '@angular/fire/firestore';

export interface Banner {
  id: string;
  url: string;
  createdAt: Date;
}

export const BannerConverter = {
  toFirestore: (data: Banner) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const data = snap.data() as Banner;
    data.createdAt = (data.createdAt as any).toDate();

    return data;
  },
};
