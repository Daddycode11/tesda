import { Injectable } from '@angular/core';
import { PhilGEPS, PhilGEPSConverter } from '../models/PhilGEPS';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostingService {
  private readonly PHIL_GEPS_COLLECTION = 'philgeps-postings';

  constructor(private firestore: Firestore) {}
  create(philgeps: PhilGEPS) {
    const ref = collection(
      this.firestore,
      this.PHIL_GEPS_COLLECTION
    ).withConverter(PhilGEPSConverter);
    const docRef = doc(ref);
    philgeps.id = docRef.id;
    return setDoc(docRef, philgeps);
  }

  getAll(): Observable<PhilGEPS[]> {
    const q = query(
      collection(this.firestore, this.PHIL_GEPS_COLLECTION).withConverter(
        PhilGEPSConverter
      ),
      orderBy('createdAt', 'desc')
    );
    return collectionData(q);
  }
  update(philgeps: PhilGEPS) {
    const ref = collection(
      this.firestore,
      this.PHIL_GEPS_COLLECTION
    ).withConverter(PhilGEPSConverter);
    const docRef = doc(ref, philgeps.id);
    const updatedPhilgeps = {
      ...philgeps,
      updatedAt: new Date(),
    };
    return updateDoc(docRef, updatedPhilgeps);
  }

  delete(id: string) {
    return deleteDoc(doc(this.firestore, this.PHIL_GEPS_COLLECTION, id));
  }
}
