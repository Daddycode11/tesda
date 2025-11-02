import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  linkWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  UserCredential,
} from '@angular/fire/auth';
import {
  collection,
  collectionCountSnap,
  collectionData,
  doc,
  docData,
  Firestore,
  getDoc,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { map, Observable, of, switchMap } from 'rxjs';
import { User, UserConverter, UserType } from '../models/Users';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly USER_COLLECTION = 'users';

  constructor(private auth: Auth, private firestore: Firestore) {}

  // --- Shared helper for creating Firestore user ---
  private async createUserDocument(
    uid: string,
    data: Partial<User>
  ): Promise<User> {
    const userRef = doc(
      collection(this.firestore, this.USER_COLLECTION).withConverter(
        UserConverter
      ),
      uid
    );

    const userData: User = {
      id: uid,
      name: data.name ?? '',
      age: data.age ?? 18,
      gender: data.gender ?? '',
      email: data.email ?? '',
      profile: data.profile ?? '',
      createdAt: new Date(),
      updatedAt: new Date(),
      type: data.type ?? UserType.USER,
    };

    await setDoc(userRef, userData);
    return userData;
  }

  // --- EMAIL REGISTRATION ---
  async registerWithEmailAndPassword(
    name: string,
    age: number,
    gender: string,
    email: string,
    password: string
  ): Promise<User> {
    const cred = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    return this.createUserDocument(cred.user.uid, { name, age, gender, email });
  }

  // --- EMAIL LOGIN ---
  async loginWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<User> {
    const result = await signInWithEmailAndPassword(this.auth, email, password);
    return this.getOrThrowUserFromFirestore(result.user.uid);
  }

  // --- GOOGLE REGISTRATION ---
  async registerWithGoogle(): Promise<User> {
    const cred = await signInWithPopup(this.auth, new GoogleAuthProvider());
    const uid = cred.user.uid;
    const email = cred.user.email || '';

    // Check if user already exists
    const userRef = doc(
      collection(this.firestore, this.USER_COLLECTION).withConverter(
        UserConverter
      ),
      uid
    );
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      // Already registered
      return snap.data()!;
    }

    // Otherwise create new document
    return this.createUserDocument(uid, {
      name: cred.user.displayName || '',
      email,
      profile: cred.user.photoURL || '',
      type: UserType.USER,
    });
  }
  async loginWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();

    try {
      // Attempt Google sign-in
      const result = await signInWithPopup(this.auth, provider);
      const googleUser = result.user;

      if (!googleUser.email) {
        await signOut(this.auth);
        throw new Error('Google account does not have an email address.');
      }

      const email = googleUser.email;

      // Fetch existing sign-in methods for this email
      const methods = await fetchSignInMethodsForEmail(this.auth, email);

      // 🚫 Reject if the email exists but was not registered with Google
      if (methods.length > 0 && !methods.includes('google.com')) {
        await signOut(this.auth);
        // Small delay to ensure auth state resets before throwing
        await new Promise((r) => setTimeout(r, 250));
        throw new Error('Wrong provider');
      }

      // ✅ If we got here, provider is valid — continue
      return this.getOrThrowUserFromFirestore(googleUser.uid);
    } catch (error: any) {
      // Handle Firebase conflict error (email exists with another provider)
      if (error.code === 'auth/account-exists-with-different-credential') {
        await signOut(this.auth);
        await new Promise((r) => setTimeout(r, 250));
        throw new Error('Wrong provider');
      }

      console.error('Google login failed:', error);
      throw new Error(error.message || 'Google login failed.');
    }
  }

  // --- HELPER: Fetch Firestore user ---
  private async getOrThrowUserFromFirestore(uid: string): Promise<User> {
    const userDocRef = doc(
      collection(this.firestore, this.USER_COLLECTION).withConverter(
        UserConverter
      ),
      uid
    );
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
      await signOut(this.auth);
      throw new Error('User not found in Firestore.');
    }

    return userSnapshot.data()!;
  }

  // --- LOGOUT ---
  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  // --- OBSERVABLE USER STREAM ---
  getCurrentUser(): Observable<User | null> {
    return authState(this.auth).pipe(
      switchMap((firebaseUser) => {
        if (!firebaseUser) return of(null);
        const userDoc = doc(
          collection(this.firestore, this.USER_COLLECTION).withConverter(
            UserConverter
          ),
          firebaseUser.uid
        );
        return docData(userDoc).pipe(map((data) => data ?? null));
      })
    );
  }

  // --- DIRECT GET USER ---
  async getUser(): Promise<User | null> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) return null;

    const result = await getDoc(
      doc(
        collection(this.firestore, this.USER_COLLECTION).withConverter(
          UserConverter
        ),
        currentUser.uid
      )
    );

    return result.exists() ? result.data()! : null;
  }

  getAllUsers(): Observable<User[]> {
    const q = query(
      collection(this.firestore, this.USER_COLLECTION).withConverter(
        UserConverter
      ),
      where('type', '==', UserType.USER)
    );
    return collectionData(q);
  }
}
