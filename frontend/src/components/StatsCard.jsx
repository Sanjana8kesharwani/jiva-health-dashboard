import React from 'react';

export default function StatsCard({ title, value, icon: Icon, iconBg = 'bg-emerald-50 text-emerald-600', valueClass = 'text-gray-900' }) {
  let finalIconBg = iconBg;
  if (iconBg.includes('bg-blue-50')) finalIconBg += ' dark:bg-blue-950/40 dark:text-blue-400';
  else if (iconBg.includes('bg-amber-50')) finalIconBg += ' dark:bg-amber-950/40 dark:text-amber-400';
  else if (iconBg.includes('bg-emerald-50')) finalIconBg += ' dark:bg-emerald-950/40 dark:text-emerald-400';
  else if (iconBg.includes('bg-rose-50')) finalIconBg += ' dark:bg-rose-950/40 dark:text-rose-400';
  else if (iconBg.includes('bg-purple-50')) finalIconBg += ' dark:bg-purple-950/40 dark:text-purple-400';
  else if (iconBg.includes('bg-gray-100')) finalIconBg += ' dark:bg-slate-800 dark:text-slate-300';

  const finalValueClass = valueClass === 'text-gray-900' ? 'text-gray-900 dark:text-slate-100' : valueClass;

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center justify-between transition-all duration-200 hover:shadow-md">
      <div className="space-y-1">
        <span className="text-sm font-medium text-gray-500 dark:text-slate-400">{title}</span>
        <h3 className={`text-2xl font-bold tracking-tight ${finalValueClass}`}>{value}</h3>
      </div>
      {Icon && (
        <div className={`p-3 rounded-xl ${finalIconBg} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}
