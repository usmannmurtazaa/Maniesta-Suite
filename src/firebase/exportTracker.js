import { db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function trackExport(data) {
  const payload = {
    ...data,
    createdAt: new Date(),
    userAgent: data.deviceInfo?.userAgent || navigator.userAgent,
    platform: data.deviceInfo?.platform || navigator.platform,
    language: data.deviceInfo?.language || navigator.language,
  };
  await addDoc(collection(db, 'exports'), payload);
}