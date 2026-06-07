import type { Car } from "../types";

interface MetricsBarProps {
  cars: Car[];
}

function fmt(n: number) {
  return n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });
}

export default function MetricsBar({ cars }: MetricsBarProps) {
  const totalCost = cars.reduce((s, c) => s + c.totalCost, 0);
  const totalBase = cars.reduce((s, c) => s + c.baseCost, 0);
  const totalAddOns = cars.reduce(
    (s, c) => s + c.addOns.reduce((a, o) => a + o.amount, 0),
    0
  );

  const metrics = [
    { label: "Total Portfolio", value: fmt(totalCost), highlight: true },
    { label: "Total Base Costs", value: fmt(totalBase), highlight: false },
    { label: "Total Add-ons", value: fmt(totalAddOns), highlight: false },
    { label: "Cars", value: String(cars.length), highlight: false },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {metrics.map((m) => (
        <div
          key={m.label}
          className={`rounded-xl p-4 ${
            m.highlight
              ? "bg-red-600 text-white"
              : "bg-white border border-gray-100"
          }`}
        >
          <p className={`text-xs font-medium mb-1 ${m.highlight ? "text-red-100" : "text-gray-400"}`}>
            {m.label}
          </p>
          <p className={`text-xl font-bold ${m.highlight ? "text-white" : "text-gray-800"}`}>
            {m.value}
          </p>
        </div>
      ))}
    </div>
  );
}
