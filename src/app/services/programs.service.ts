import { Injectable } from '@angular/core';
import { Services, ServicesConverter, ServiceType } from '../models/Services';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  setDoc,
  startAfter,
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
import { async, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProgramsService {
  private readonly SERVICES_COLLECTION = 'services';
  constructor(private firestore: Firestore, private storage: Storage) {}

  /**
   * Fetch services with optional type, search filter, and cursor-based pagination
   * @param type Filter by service type, null for all
   * @param lastIndex Last document snapshot for pagination (null for first page)
   * @param count Number of items to fetch
   * @param search Optional search string
   */
  async getServices(
    type: string | null,
    lastIndex: QueryDocumentSnapshot<Services> | null,
    count: number,
    search: string | null = null
  ): Promise<{
    items: Services[];
    lastIndex: QueryDocumentSnapshot<Services> | null;
    total: number;
  }> {
    // Base query for items with ordering
    let servicesQuery = query(
      collection(this.firestore, this.SERVICES_COLLECTION).withConverter(
        ServicesConverter
      ),
      orderBy('updatedAt', 'desc'),
      limit(count)
    );

    // Filter by type if provided
    if (type && type !== 'All Services') {
      servicesQuery = query(servicesQuery, where('type', '==', type));
    }

    // Apply cursor for pagination
    if (lastIndex) {
      servicesQuery = query(servicesQuery, startAfter(lastIndex));
    }

    // Fetch documents for current page
    const snapshot = await getDocs(servicesQuery);
    let items = snapshot.docs.map((doc) => doc.data());

    // Apply search filter locally
    if (search) {
      const searchLower = search.toLowerCase();
      items = items.filter((item) =>
        item.title.toLowerCase().includes(searchLower)
      );
    }

    const newLastIndex = snapshot.docs[snapshot.docs.length - 1] || null;

    // Total count query (without limit and startAfter)
    let totalQuery = query(
      collection(this.firestore, this.SERVICES_COLLECTION).withConverter(
        ServicesConverter
      )
    );
    if (type && type !== 'All Services') {
      totalQuery = query(totalQuery, where('type', '==', type));
    }
    const totalSnapshot = await getDocs(totalQuery);

    // Apply search filter locally for total as well
    let total = totalSnapshot.size;
    if (search) {
      const searchLower = search.toLowerCase();
      total = totalSnapshot.docs.filter((doc) =>
        doc.data().title.toLowerCase().includes(searchLower)
      ).length;
    }

    return { items, lastIndex: newLastIndex, total };
  }

  async create(service: Services, file: File | null): Promise<void> {
    const collectionRef = collection(this.firestore, this.SERVICES_COLLECTION);
    const docRef = doc(collectionRef);
    const id = docRef.id;

    let fileUrl: string | null = null;

    if (file) {
      const ext = file.name.split('.').pop(); // Get file extension
      const fileRef = ref(this.storage, `services/files/${id}.${ext}`);
      await uploadBytes(fileRef, file);
      fileUrl = await getDownloadURL(fileRef);
    }

    const newService: Services = {
      ...service,
      id,
      file: fileUrl,
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

  async getById(id: string): Promise<Services | null> {
    try {
      const docRef = doc(
        this.firestore,
        this.SERVICES_COLLECTION,
        id
      ).withConverter(ServicesConverter);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error(`Error fetching document with ID ${id}:`, error);
      return null;
    }
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
  getAll(): Observable<Services[]> {
    const q = query(
      collection(this.firestore, this.SERVICES_COLLECTION).withConverter(
        ServicesConverter
      ),

      orderBy('updatedAt', 'desc')
    );
    return collectionData(q);
  }
  async update(service: Services, file: File | null): Promise<void> {
    const docRef = doc(this.firestore, this.SERVICES_COLLECTION, service.id);

    const updatePayload: Partial<Services> = {
      ...service,
      updatedAt: new Date(),
    };

    const updateFile = async (): Promise<string | null> => {
      if (!file) return service.file || null;

      // Delete old file if exists
      if (service.file) {
        try {
          const oldRef = ref(this.storage, service.file);
          await deleteObject(oldRef);
        } catch (err) {
          console.warn('⚠️ Failed to delete old file:', err);
        }
      }

      // Upload new file with extension and unique timestamp
      const ext = file.name.split('.').pop();
      const timestamp = Date.now();
      const newRef = ref(
        this.storage,
        `services/files/${service.id}_${timestamp}.${ext}`
      );

      await uploadBytes(newRef, file);
      return await getDownloadURL(newRef);
    };

    try {
      const fileUrl = await updateFile();
      updatePayload.file = fileUrl;
      await updateDoc(docRef, updatePayload);
    } catch (error) {
      console.error('Failed to update service:', error);
      throw error;
    }
  }
}
