import type { Car } from "../types";

interface CarCardProps {
  car: Car;
  onEdit: (car: Car) => void;
  onDelete: (id: string) => void;
}

function fmt(n: number) {
  return n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });
}

export default function CarCard({ car, onEdit, onDelete }: CarCardProps) {
  const addOnsTotal = car.addOns.reduce((s, a) => s + a.amount, 0);

  async function handleShare() {
    await navigator.clipboard.writeText(car.model);
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
      {/* Title row */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-bold text-gray-800 leading-tight">{car.model}</h3>
        <span className="text-lg font-bold text-red-600 whitespace-nowrap">
          {fmt(car.totalCost)}
        </span>
      </div>

      {/* Cost breakdown */}
      <div className="text-sm text-gray-500 space-y-1">
        <div className="flex justify-between">
          <span>Base cost</span>
          <span className="font-medium text-gray-700">{fmt(car.baseCost)}</span>
        </div>
        {car.addOns.length > 0 && (
          <div className="flex justify-between">
            <span>Add-ons ({car.addOns.length})</span>
            <span className="font-medium text-gray-700">{fmt(addOnsTotal)}</span>
          </div>
        )}
      </div>

      {/* Add-ons list */}
      {car.addOns.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-3 space-y-1">
          {car.addOns.map((a) => (
            <div key={a.id} className="flex justify-between text-xs text-gray-600">
              <span>{a.label}</span>
              <span>{fmt(a.amount)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Partners */}
      {car.partners.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Partners
          </p>
          <div className="space-y-1.5">
            {car.partners.map((p) => {
              const pct = car.totalCost > 0 ? (p.invested / car.totalCost) * 100 : 0;
              return (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 font-medium">{p.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{pct.toFixed(1)}%</span>
                    <span className="font-semibold text-gray-800">{fmt(p.invested)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1 border-t border-gray-50">
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-300 rounded-lg py-2 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Share
        </button>
        <button
          onClick={() => onEdit(car)}
          className="flex-1 flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-300 rounded-lg py-2 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
        <button
          onClick={() => onDelete(car.id)}
          className="flex items-center justify-center gap-1.5 px-3 text-sm text-gray-400 hover:text-red-600 border border-gray-200 hover:border-red-300 rounded-lg py-2 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
