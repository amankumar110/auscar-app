import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getCars, addCar, updateCar, deleteCar } from "../lib/firestore";
import type { Car } from "../types";
import Header from "./Header";
import MetricsBar from "./MetricsBar";
import CarCard from "./CarCard";
import CarForm from "./CarForm";

export default function Dashboard() {
  const { user } = useAuth();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | undefined>();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    getCars(user.uid)
      .then((data) => setCars(data))
      .catch((err) => console.error("Failed to load cars:", err))
      .finally(() => setLoading(false));
  }, [user]);

  async function handleSave(data: Omit<Car, "id" | "createdAt" | "updatedAt">) {
    if (!user) return;
    if (editingCar) {
      await updateCar(user.uid, editingCar.id, data);
      setCars((prev) =>
        prev.map((c) =>
          c.id === editingCar.id ? { ...c, ...data, updatedAt: Date.now() } : c
        )
      );
    } else {
      const now = Date.now();
      const id = await addCar(user.uid, { ...data, createdAt: now, updatedAt: now });
      setCars((prev) => [{ id, ...data, createdAt: now, updatedAt: now }, ...prev]);
    }
    setShowForm(false);
    setEditingCar(undefined);
  }

  async function handleDelete(id: string) {
    if (!user) return;
    setDeletingId(id);
    await deleteCar(user.uid, id);
    setCars((prev) => prev.filter((c) => c.id !== id));
    setDeletingId(null);
  }

  function openEdit(car: Car) {
    setEditingCar(car);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingCar(undefined);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAddCar={() => setShowForm(true)} />

      <main className="max-w-6xl mx-auto px-4 py-6">
        <MetricsBar cars={cars} />

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : cars.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="text-gray-500 text-base mb-1">No cars yet</p>
            <p className="text-gray-400 text-sm mb-5">Add your first car to get started</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
            >
              Add Car
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cars.map((car) => (
              <div key={car.id} className={deletingId === car.id ? "opacity-50 pointer-events-none" : ""}>
                <CarCard car={car} onEdit={openEdit} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <CarForm
          initial={editingCar}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}
    </div>
  );
}
