import { Injectable } from '@angular/core';
import { Schedule, ScheduleConverter } from '../models/Schedule';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  orderBy,
  query,
  setDoc,
  where,
  writeBatch,
} from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { SAMPLE_SCHEDULES } from '../utils/Constants';

export interface SchedulesPerDay {
  date: string;
  slots: string;
  schedules: Schedule[];
}

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private readonly SCHEDULE_COLLECTION = 'schedules';
  constructor(private firestore: Firestore) {}

  create(date: string, time: string, slots: number) {
    const ref = collection(this.firestore, this.SCHEDULE_COLLECTION);
    const sched: Schedule = {
      id: doc(ref).id,
      date: date,
      time: time,
      slots: slots,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return setDoc(
      doc(this.firestore, this.SCHEDULE_COLLECTION, sched.id),
      sched
    );
  }
  getScheduleByMonth(
    month: number,
    year: number = 2025
  ): Observable<SchedulesPerDay[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const startString = startDate.toISOString().split('T')[0];
    const endString = endDate.toISOString().split('T')[0];

    const q = query(
      collection(this.firestore, this.SCHEDULE_COLLECTION).withConverter(
        ScheduleConverter
      ),
      where('date', '>=', startString),
      where('date', '<=', endString),
      orderBy('date', 'asc')
    );

    return collectionData(q, { idField: 'id' }).pipe(
      map((schedules) => {
        const grouped: Record<string, Schedule[]> = {};

        for (const s of schedules as Schedule[]) {
          if (!grouped[s.date]) grouped[s.date] = [];
          grouped[s.date].push(s);
        }

        return Object.entries(grouped).map(([date, list]) => ({
          date,
          slots: list.reduce((sum, sched) => sum + sched.slots, 0).toString(),
          schedules: list.sort((a, b) => a.time.localeCompare(b.time)),
        }));
      })
    );
  }

  addAll(schedule: Schedule[] = SAMPLE_SCHEDULES) {
    const batch = writeBatch(this.firestore);
    schedule.forEach((e) => {
      const docRef = doc(this.firestore, this.SCHEDULE_COLLECTION, e.id);
      batch.set(docRef, e);
    });
    return batch.commit();
  }
}
