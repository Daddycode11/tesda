import { Injectable } from '@angular/core';
import { defer, from, map, Observable, switchMap } from 'rxjs';
import { Career, CareerConverter } from '../models/Careeer';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  orderBy,
  query,
  setDoc,
  updateDoc,
  writeBatch,
} from '@angular/fire/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  Storage,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class CareerService {
  private readonly CAREER_COLLECTIONS = 'careers';
  constructor(private firestore: Firestore, private storage: Storage) {}
  getAll(): Observable<Career[]> {
    const q = query(
      collection(this.firestore, this.CAREER_COLLECTIONS).withConverter(
        CareerConverter
      ),
      orderBy('updatedAt', 'desc')
    );
    return collectionData(q);
  }

  /**
   * Create a new career with image upload.
   */
  create(title: string, description: string, image: File): Observable<void> {
    const path = `careers/${Date.now()}_${image.name}`;
    const storageRef = ref(this.storage, path);

    return from(uploadBytes(storageRef, image)).pipe(
      switchMap(() => getDownloadURL(storageRef)),
      switchMap((url) => {
        const colRef = collection(this.firestore, this.CAREER_COLLECTIONS);
        const newDocRef = doc(colRef);
        const id = newDocRef.id;

        const newCareer: Career = {
          id,
          title,
          description,
          image: url,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        return from(setDoc(newDocRef, newCareer)).pipe(map(() => void 0));
      })
    );
  }
  /**
   * Delete a career entry and its image from Firebase Storage.
   */
  delete(id: string, imageUrl: string): Observable<void> {
    return defer(async () => {
      const docRef = doc(this.firestore, `${this.CAREER_COLLECTIONS}/${id}`);
      await deleteDoc(docRef);

      const storageRef = ref(this.storage, imageUrl);
      await deleteObject(storageRef);

      return void 0;
    });
  }

  /**
   * Update a career entry. If a new image is provided, replace the old one.
   */
  update(career: Career, image: File | null): Observable<void> {
    const docRef = doc(
      this.firestore,
      `${this.CAREER_COLLECTIONS}/${career.id}`
    );

    if (image) {
      // Replace the existing image
      const newPath = `careers/${Date.now()}_${image.name}`;
      const storageRef = ref(this.storage, newPath);
      const oldImageRef = ref(this.storage, career.image);

      return from(uploadBytes(storageRef, image)).pipe(
        switchMap(() => getDownloadURL(storageRef)),
        switchMap((newUrl) =>
          from(deleteObject(oldImageRef)).pipe(
            switchMap(() =>
              from(
                updateDoc(docRef, {
                  title: career.title,
                  description: career.description,
                  image: newUrl,
                  updatedAt: new Date(),
                })
              ).pipe(map(() => void 0))
            )
          )
        )
      );
    } else {
      // Update only text fields
      return from(
        updateDoc(docRef, {
          title: career.title,
          description: career.description,
          updatedAt: new Date(),
        })
      ).pipe(map(() => void 0));
    }
  }

  async addAll(careers: Career[]) {
    const batch = writeBatch(this.firestore);
    careers.forEach((e) => {
      batch.set(doc(this.firestore, this.CAREER_COLLECTIONS, e.id), e);
    });
    await batch.commit();
  }
}
