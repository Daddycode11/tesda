import { Injectable } from '@angular/core';
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
import { RequirementConverter, Requirements } from '../models/Requirement';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequirementService {
  private readonly REQUIREMENT_COLLECTION = 'requirements';
  constructor(private firestore: Firestore) {}

  create(title: string, description: string, items: string[]) {
    const collectionRef = collection(
      this.firestore,
      this.REQUIREMENT_COLLECTION
    );
    const docRef = doc(collectionRef);

    const requirement: Requirements = {
      id: docRef.id,
      title,
      description,
      items,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return setDoc(docRef, requirement);
  }
  delete(id: string) {
    return deleteDoc(doc(this.firestore, this.REQUIREMENT_COLLECTION, id));
  }
  update(requirement: Requirements) {
    if (!requirement.id) {
      throw new Error('Requirement ID is missing');
    }

    const updatedRequirement = {
      ...requirement,
      updatedAt: new Date(),
    };

    const docRef = doc(
      this.firestore,
      this.REQUIREMENT_COLLECTION,
      requirement.id
    );
    return updateDoc(docRef, updatedRequirement);
  }
  getAll(): Observable<Requirements[]> {
    const q = query(
      collection(this.firestore, this.REQUIREMENT_COLLECTION).withConverter(
        RequirementConverter
      ),
      orderBy('updatedAt', 'desc')
    );
    return collectionData(q);
  }
}
