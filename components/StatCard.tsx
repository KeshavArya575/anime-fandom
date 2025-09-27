// components/StatCard.tsx
import { ReactNode } from 'react';

type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
};

export default function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-x-3">
        <div className="flex-shrink-0">{icon}</div>
        <div className="flex-1">
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}