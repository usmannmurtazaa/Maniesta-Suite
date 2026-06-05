import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export async function trackExport(data) {
  if (!db) return;
  await addDoc(collection(db, 'exports'), {
    ...data,
    createdAt: serverTimestamp(),
  });
}