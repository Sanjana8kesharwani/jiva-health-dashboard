import React from 'react';

export default function StatsCard({ title, value, icon: Icon, iconBg = 'bg-emerald-50 text-emerald-600', valueClass = 'text-gray-900' }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between transition-all duration-200 hover:shadow-md">
      <div className="space-y-1">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <h3 className={`text-2xl font-bold tracking-tight ${valueClass}`}>{value}</h3>
      </div>
      {Icon && (
        <div className={`p-3 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}
