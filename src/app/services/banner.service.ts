import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Storage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Banner } from '../models/Banner';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  addDoc,
  query,
} from '@angular/fire/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from '@angular/fire/storage';
import { from, switchMap, map } from 'rxjs';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class BannerService {
  private readonly BANNER_COLLECTION = 'banners';
  constructor(private firestore: Firestore, private storage: Storage) {}

  /**
   * Uploads a banner image to Firebase Storage and adds its metadata to Firestore.
   */
  add(image: File): Observable<void> {
    const path = `banners/${Date.now()}_${image.name}`;
    const storageRef = ref(this.storage, path);

    return from(uploadBytes(storageRef, image)).pipe(
      switchMap(() => getDownloadURL(storageRef)),
      switchMap((url) => {
        const banner: Omit<Banner, 'id'> = {
          url,
          createdAt: new Date(),
        } as Banner;
        const colRef = collection(this.firestore, this.BANNER_COLLECTION);
        return from(addDoc(colRef, banner)).pipe(map(() => void 0));
      })
    );
  }

  /**
   * Deletes a banner from both Firebase Storage and Firestore.
   */
  delete(url: string): Observable<void> {
    // Delete from Storage
    const storageRef = ref(this.storage, url);
    // Find the Firestore doc by URL
    const colRef = collection(this.firestore, this.BANNER_COLLECTION);

    return from(deleteObject(storageRef)).pipe(
      switchMap(() =>
        collectionData(query(colRef), { idField: 'id' }).pipe(
          map((banners) => banners as Banner[]),
          switchMap((banners) => {
            const banner = banners.find((b) => b.url === url);
            if (banner) {
              const docRef = doc(
                this.firestore,
                `${this.BANNER_COLLECTION}/${banner.id}`
              );
              return from(deleteDoc(docRef)).pipe(map(() => void 0));
            }
            return from(Promise.resolve());
          })
        )
      )
    );
  }

  /**
   * Retrieves all banners from Firestore.
   */
  getAll(): Observable<Banner[]> {
    const colRef = collection(this.firestore, this.BANNER_COLLECTION);
    return collectionData(colRef, { idField: 'id' }).pipe(
      map(
        (data) =>
          (data as any[]).map((d) => ({
            ...d,
            createdAt: (d.createdAt as any)?.toDate
              ? (d.createdAt as any).toDate()
              : d.createdAt,
          })) as Banner[]
      )
    );
  }
}
