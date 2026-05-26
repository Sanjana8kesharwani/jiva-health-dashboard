import React from 'react';
import { Inbox } from 'lucide-react';

export default function CustomTable({ columns, data, emptyMessage = "No records found" }) {
  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-100">
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data && data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr 
                  key={row.id || rowIndex} 
                  className="hover:bg-gray-50/50 transition-colors duration-150 group"
                >
                  {columns.map((col) => (
                    <td 
                      key={`${row.id || rowIndex}-${col.key}`} 
                      className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap align-middle"
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
                    <div className="p-3 bg-gray-50 rounded-full text-gray-400">
                      <Inbox className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-gray-500">{emptyMessage}</p>
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
