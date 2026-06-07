import { useState, useEffect } from "react";
import type { Car, AddOn, Partner } from "../types";

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

interface CarFormProps {
  initial?: Car;
  onSave: (data: Omit<Car, "id" | "createdAt" | "updatedAt">) => void;
  onClose: () => void;
}

export default function CarForm({ initial, onSave, onClose }: CarFormProps) {
  const [model, setModel] = useState(initial?.model ?? "");
  const [baseCost, setBaseCost] = useState(initial?.baseCost?.toString() ?? "");
  const [addOns, setAddOns] = useState<AddOn[]>(
    initial?.addOns ?? [{ id: newId(), label: "", amount: 0 }]
  );
  const [partners, setPartners] = useState<Partner[]>(
    initial?.partners ?? [{ id: newId(), name: "", invested: 0 }]
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalCost =
    (parseFloat(baseCost) || 0) +
    addOns.reduce((s, a) => s + (a.amount || 0), 0);

  const partnersTotal = partners.reduce((s, p) => s + (p.invested || 0), 0);
  const partnersDiff = Math.abs(partnersTotal - totalCost);
  const partnersValid = totalCost === 0 || partnersDiff < 0.01;

  // Clear stale partner error whenever totalCost or partners change
  useEffect(() => {
    setErrors((prev) => {
      if (!prev.partners) return prev;
      return { ...prev, partners: "" };
    });
  }, [totalCost, partnersTotal]);

  function fmt(n: number) {
    return n.toLocaleString("en-AU", {
      style: "currency",
      currency: "AUD",
      maximumFractionDigits: 0,
    });
  }

  // Add-on helpers
  function addAddOn() {
    setAddOns((prev) => [...prev, { id: newId(), label: "", amount: 0 }]);
  }
  function removeAddOn(id: string) {
    setAddOns((prev) => prev.filter((a) => a.id !== id));
  }
  function updateAddOn(id: string, field: "label" | "amount", value: string) {
    setAddOns((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, [field]: field === "amount" ? parseFloat(value) || 0 : value }
          : a
      )
    );
  }

  // Partner helpers
  function addPartner() {
    setPartners((prev) => [...prev, { id: newId(), name: "", invested: 0 }]);
  }
  function removePartner(id: string) {
    setPartners((prev) => prev.filter((p) => p.id !== id));
  }
  function updatePartner(
    id: string,
    field: "name" | "invested",
    value: string
  ) {
    setPartners((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, [field]: field === "invested" ? parseFloat(value) || 0 : value }
          : p
      )
    );
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!model.trim()) e.model = "Car model is required";
    if (!baseCost || parseFloat(baseCost) < 0) e.baseCost = "Enter a valid base cost";
    if (!partnersValid)
      e.partners = `Partner investments (${fmt(partnersTotal)}) must equal total cost (${fmt(totalCost)})`;
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSave({
      model: model.trim(),
      baseCost: parseFloat(baseCost),
      addOns: addOns.filter((a) => a.label.trim()),
      partners: partners.filter((p) => p.name.trim()),
      totalCost,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-gray-800">
            {initial ? "Edit Car" : "Add Car"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6">
          {/* Model */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Car Model
            </label>
            <input
              type="text"
              placeholder="e.g. 2020 Toyota Camry"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.model ? "border-red-400" : "border-gray-200"
              }`}
            />
            {errors.model && (
              <p className="text-xs text-red-500 mt-1">{errors.model}</p>
            )}
          </div>

          {/* Base Cost */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Base Cost (AUD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="0"
                value={baseCost}
                onChange={(e) => setBaseCost(e.target.value)}
                className={`w-full border rounded-lg pl-7 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.baseCost ? "border-red-400" : "border-gray-200"
                }`}
              />
            </div>
            {errors.baseCost && (
              <p className="text-xs text-red-500 mt-1">{errors.baseCost}</p>
            )}
          </div>

          {/* Add-ons */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Add-ons</label>
              <button
                type="button"
                onClick={addAddOn}
                className="text-xs text-red-600 hover:text-red-700 font-semibold cursor-pointer"
              >
                + Add
              </button>
            </div>
            <div className="space-y-2">
              {addOns.map((a) => (
                <div key={a.id} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Label (e.g. Tyres)"
                    value={a.label}
                    onChange={(e) => updateAddOn(a.id, "label", e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <div className="relative w-32">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="0"
                      value={a.amount || ""}
                      onChange={(e) => updateAddOn(a.id, "amount", e.target.value)}
                      className="w-full border border-gray-200 rounded-lg pl-7 pr-2 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  {addOns.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAddOn(a.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors cursor-pointer flex-shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Total cost display */}
          <div className="bg-gray-50 rounded-xl px-4 py-3 flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-600">Total Cost</span>
            <span className="text-lg font-bold text-red-600">{fmt(totalCost)}</span>
          </div>

          {/* Partners */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Partners</label>
              <button
                type="button"
                onClick={addPartner}
                className="text-xs text-red-600 hover:text-red-700 font-semibold cursor-pointer"
              >
                + Add
              </button>
            </div>
            <div className="space-y-2">
              {partners.map((p) => {
                const pct =
                  totalCost > 0 ? ((p.invested / totalCost) * 100).toFixed(1) : "0";
                return (
                  <div key={p.id} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Partner name"
                      value={p.name}
                      onChange={(e) => updatePartner(p.id, "name", e.target.value)}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <div className="relative w-32">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="0"
                        value={p.invested || ""}
                        onChange={(e) => updatePartner(p.id, "invested", e.target.value)}
                        className="w-full border border-gray-200 rounded-lg pl-7 pr-2 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-10 text-right flex-shrink-0">
                      {pct}%
                    </span>
                    {partners.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePartner(p.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors cursor-pointer flex-shrink-0"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            {/* Partners validation feedback */}
            {partners.some((p) => p.name.trim()) && (
              <div
                className={`mt-2 text-xs flex items-center gap-1.5 ${
                  partnersValid ? "text-green-600" : "text-amber-500"
                }`}
              >
                {partnersValid ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Partner investments balance
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {fmt(partnersDiff)} unallocated
                  </>
                )}
              </div>
            )}
            {errors.partners && (
              <p className="text-xs text-red-500 mt-1">{errors.partners}</p>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer text-sm"
            >
              {initial ? "Save Changes" : "Add Car"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
