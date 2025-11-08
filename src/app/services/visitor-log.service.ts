import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDocs,
  query,
  setDoc,
  Timestamp,
  where,
} from '@angular/fire/firestore';
import { Visitor, VisitorConverter } from '../models/Visitor';

@Injectable({
  providedIn: 'root',
})
export class VisitorLogService {
  private readonly VISITOR_LOG_COLLECTION = 'visitors';

  constructor(private firestore: Firestore) {}

  async checkIfUserLoggedToday(uid: string): Promise<boolean> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const visitorQuery = query(
      collection(this.firestore, this.VISITOR_LOG_COLLECTION).withConverter(
        VisitorConverter
      ),
      where('uid', '==', uid),
      where('loggedAt', '>=', Timestamp.fromDate(startOfDay)),
      where('loggedAt', '<=', Timestamp.fromDate(endOfDay))
    );

    const snapshot = await getDocs(visitorQuery);
    return !snapshot.empty;
  }

  async saveLog(uid: string): Promise<void> {
    try {
      const alreadyLogged = await this.checkIfUserLoggedToday(uid);
      if (!alreadyLogged) {
        const ref = doc(
          collection(this.firestore, this.VISITOR_LOG_COLLECTION)
        );
        const id = ref.id;

        const visit: Visitor = {
          id,
          loggedAt: new Date(),
          uid,
        };

        await setDoc(ref.withConverter(VisitorConverter), visit);
      }
    } catch (e) {
      console.error('Failed to save visitor log:', e);
    }
  }
}
