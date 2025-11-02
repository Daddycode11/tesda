import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Activity, ActivityConverter } from '../models/Activity';

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
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private readonly ACTIVITY_COLLECTION = 'activities';
  constructor(private firestore: Firestore, private storage: Storage) {}

  async add(activity: Activity, image: File): Promise<void> {
    const id = activity.id || crypto.randomUUID();
    const imagePath = `${this.ACTIVITY_COLLECTION}/${id}/image.jpg`;
    const imageRef = ref(this.storage, imagePath);

    await uploadBytes(imageRef, image);
    const imageUrl = await getDownloadURL(imageRef);

    const now = new Date();
    const newActivity: Activity = {
      ...activity,
      id,
      image: imageUrl,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(
      doc(this.firestore, this.ACTIVITY_COLLECTION, id).withConverter(
        ActivityConverter
      ),
      newActivity
    );
  }

  async update(activity: Activity, image: File | null): Promise<void> {
    let imageUrl = activity.image;

    if (image) {
      const imagePath = `${this.ACTIVITY_COLLECTION}/${activity.id}/image.jpg`;
      const imageRef = ref(this.storage, imagePath);
      await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(imageRef);
    }

    const updatedActivity: Activity = {
      ...activity,
      image: imageUrl,
      updatedAt: new Date(),
    };

    await updateDoc(
      doc(this.firestore, this.ACTIVITY_COLLECTION, activity.id).withConverter(
        ActivityConverter
      ),
      updatedActivity
    );
  }

  async delete(id: string) {
    await deleteDoc(doc(this.firestore, this.ACTIVITY_COLLECTION, id));
  }
  getAll(): Observable<Activity[]> {
    const q = query(
      collection(this.firestore, this.ACTIVITY_COLLECTION).withConverter(
        ActivityConverter
      ),
      orderBy('sortableDate', 'asc')
    );
    return collectionData(q);
  }
}
