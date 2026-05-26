import React from 'react';

export function Input({ label, id, error, className = '', ...props }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-4 py-2 text-sm text-gray-800 dark:text-slate-200 bg-white dark:bg-slate-800 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-150 ${
          error ? 'border-rose-300 dark:border-rose-900/60 focus:ring-rose-500/20 focus:border-rose-500' : 'border-gray-200 dark:border-slate-700'
        }`}
        {...props}
      />
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  );
}

export function Select({ label, id, options = [], error, className = '', ...props }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full px-4 py-2 text-sm text-gray-800 dark:text-slate-200 bg-white dark:bg-slate-800 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-150 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[right_0.5rem_center] bg-[length:1.25rem_1.25rem] bg-no-repeat pr-10 ${
          error ? 'border-rose-300 dark:border-rose-900/60 focus:ring-rose-500/20 focus:border-rose-500' : 'border-gray-200 dark:border-slate-700'
        }`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="dark:bg-slate-800 dark:text-slate-200">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  );
}

export function Textarea({ label, id, error, className = '', ...props }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={props.rows || 3}
        className={`w-full px-4 py-2 text-sm text-gray-800 dark:text-slate-200 bg-white dark:bg-slate-800 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-150 ${
          error ? 'border-rose-300 dark:border-rose-900/60 focus:ring-rose-500/20 focus:border-rose-500' : 'border-gray-200 dark:border-slate-700'
        }`}
        {...props}
      />
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  );
}
