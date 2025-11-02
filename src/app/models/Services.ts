import { QueryDocumentSnapshot } from '@angular/fire/firestore';

export interface Services {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  link: string | null;
  type: ServiceType;
  createdAt: Date;
  updatedAt: Date;
}
export const ServicesConverter = {
  toFirestore: (data: Services) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const data = snap.data() as Services;
    data.createdAt = (data.createdAt as any).toDate();
    data.updatedAt = (data.updatedAt as any).toDate();
    return data;
  },
};

export enum ServiceType {
  SERVICE = 'Services',
  OTHER = 'Other Services',
  PROGRAM = 'Programs & Services',
}
