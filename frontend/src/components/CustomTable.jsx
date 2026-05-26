import React from 'react';
import { Inbox } from 'lucide-react';

export default function CustomTable({ columns, data, emptyMessage = "No records found" }) {
  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/70 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
            {data && data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr 
                  key={row.id || rowIndex} 
                  className="hover:bg-gray-50/50 dark:hover:bg-slate-800/40 transition-colors duration-150 group"
                >
                  {columns.map((col) => (
                    <td 
                      key={`${row.id || rowIndex}-${col.key}`} 
                      className="px-6 py-4 text-sm text-gray-700 dark:text-slate-300 whitespace-nowrap align-middle"
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-full text-gray-400 dark:text-slate-500">
                      <Inbox className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-gray-500 dark:text-slate-400">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
