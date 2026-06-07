import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Car } from "../types";

const carsCollection = (uid: string) =>
  collection(db, "users", uid, "cars");

export async function getCars(uid: string): Promise<Car[]> {
  const q = query(carsCollection(uid), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Car));
}

export async function addCar(
  uid: string,
  car: Omit<Car, "id">
): Promise<string> {
  const ref = await addDoc(carsCollection(uid), car);
  return ref.id;
}

export async function updateCar(
  uid: string,
  carId: string,
  car: Partial<Omit<Car, "id">>
): Promise<void> {
  const ref = doc(db, "users", uid, "cars", carId);
  await updateDoc(ref, { ...car, updatedAt: Date.now() });
}

export async function deleteCar(uid: string, carId: string): Promise<void> {
  const ref = doc(db, "users", uid, "cars", carId);
  await deleteDoc(ref);
}
