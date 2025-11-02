import { Injectable } from '@angular/core';
import { Services, ServicesConverter, ServiceType } from '../models/Services';
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
  where,
} from '@angular/fire/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  Storage,
  deleteObject,
} from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProgramsService {
  private readonly SERVICES_COLLECTION = 'services';
  constructor(private firestore: Firestore, private storage: Storage) {}
  async create(service: Services, icon: File | null): Promise<void> {
    const collectionRef = collection(this.firestore, this.SERVICES_COLLECTION);
    const docRef = doc(collectionRef);
    const id = docRef.id;

    let iconUrl: string | null = null;

    if (icon) {
      const iconRef = ref(this.storage, `services/icons/${id}`);
      await uploadBytes(iconRef, icon);
      iconUrl = await getDownloadURL(iconRef);
    }

    const newService: Services = {
      ...service,
      id,
      icon: iconUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(docRef, newService);
  }
  async delete(id: string, iconUrl: string | null): Promise<void> {
    const docRef = doc(this.firestore, this.SERVICES_COLLECTION, id);
    const deleteOps: Promise<any>[] = [deleteDoc(docRef)];

    if (iconUrl) {
      const iconRef = ref(this.storage, iconUrl);
      deleteOps.push(deleteObject(iconRef));
    }

    return Promise.all(deleteOps)
      .then(() => {
        console.log(`Service ${id} and icon deleted successfully`);
      })
      .catch((err) => {
        console.error('Deletion failed:', err);
        throw err;
      });
  }

  getByType(type: ServiceType): Observable<Services[]> {
    const q = query(
      collection(this.firestore, this.SERVICES_COLLECTION).withConverter(
        ServicesConverter
      ),
      where('type', '==', type),
      orderBy('updatedAt', 'desc')
    );
    return collectionData(q);
  }
  async update(service: Services, icon: File | null): Promise<void> {
    const docRef = doc(this.firestore, this.SERVICES_COLLECTION, service.id);

    const updatePayload: Partial<Services> = {
      ...service,
      updatedAt: new Date(),
    };

    const updateIcon = async (): Promise<string | null> => {
      if (!icon) return service.icon || null;

      if (service.icon) {
        try {
          const oldRef = ref(this.storage, service.icon);
          await deleteObject(oldRef);
        } catch (err) {
          console.warn('Failed to delete old icon:', err);
        }
      }

      // Upload new icon
      const newRef = ref(this.storage, `services/icons/${service.id}`);
      await uploadBytes(newRef, icon);
      return await getDownloadURL(newRef);
    };

    return updateIcon().then((iconUrl) => {
      updatePayload.icon = iconUrl;
      return updateDoc(docRef, updatePayload);
    });
  }
}
