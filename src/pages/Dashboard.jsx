import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Activity, 
  FlaskConical, 
  ShoppingBag, 
  Truck, 
  ArrowUpRight, 
  Calendar, 
  Plus, 
  ShieldAlert, 
  Settings 
} from 'lucide-react';
import StatsCard from '../components/StatsCard';
import { useStore } from '../store/useStore';
import { mockDashboardStats } from '../data/dummyData';

export default function Dashboard() {
  const navigate = useNavigate();
  const { users } = useStore();

  const totalUsers = users.length;
  const primeUsers = users.filter(u => u.isPrime).length;
  
  const recentActivities = [
    { id: 1, title: "New user registered", desc: "Alice Williams joined as a Patient", time: "10 mins ago" },
    { id: 2, title: "Order Delivered", desc: "Order ORD-92837 delivered to Mumbai", time: "1 hour ago" },
    { id: 3, title: "Consultation Completed", desc: "Dr. Charlie Davis completed session #1024", time: "2 hours ago" },
    { id: 4, title: "Payment Received", desc: "Received ₹5,000.00 from Bob Smith (Card)", time: "4 hours ago" }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Welcome to Jiva Health</h1>
        <p className="text-sm text-gray-500 mt-1">Here is what's happening in your clinic today.</p>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard 
          title="Total Users" 
          value={totalUsers} 
          icon={Users} 
          iconBg="bg-blue-50 text-blue-600" 
        />
        <StatsCard 
          title="Prime Users" 
          value={primeUsers} 
          icon={Activity} 
          iconBg="bg-amber-50 text-amber-600" 
        />
        <StatsCard 
          title="Active Consultations" 
          value={mockDashboardStats.activeConsultations} 
          icon={Calendar} 
          iconBg="bg-emerald-50 text-emerald-600" 
        />
        <StatsCard 
          title="Pending Orders" 
          value={mockDashboardStats.medicineOrdersPending} 
          icon={ShoppingBag} 
          iconBg="bg-rose-50 text-rose-600" 
        />
      </div>

      {/* Dashboard Sub-grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Recent Activity */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-50 pb-4">
            <h3 className="font-bold text-gray-800">Recent System Activity</h3>
            <button 
              onClick={() => navigate('/users')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5"
            >
              View Users <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flow-root">
            <ul className="-mb-8">
              {recentActivities.map((act, actIdx) => (
                <li key={act.id}>
                  <div className="relative pb-8">
                    {actIdx !== recentActivities.length - 1 ? (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-100" aria-hidden="true" />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                          <Activity className="w-4 h-4" />
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{act.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{act.desc}</p>
                        </div>
                        <div className="text-right text-xs whitespace-nowrap text-gray-400">
                          {act.time}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Side: Quick Administrative Actions */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="font-bold text-gray-800 border-b border-gray-50 pb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-3.5">
            <button 
              onClick={() => navigate('/users?add=true')} 
              className="w-full flex items-center justify-between p-3.5 bg-emerald-50 hover:bg-emerald-100/80 rounded-xl text-left transition-colors duration-150 group cursor-pointer"
            >
              <div className="flex items-center gap-3 text-emerald-800 font-semibold text-sm">
                <Plus className="w-4.5 h-4.5" />
                <span>Add Patient Account</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-emerald-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <button 
              onClick={() => navigate('/orders')} 
              className="w-full flex items-center justify-between p-3.5 bg-blue-50 hover:bg-blue-100/80 rounded-xl text-left transition-colors duration-150 group cursor-pointer"
            >
              <div className="flex items-center gap-3 text-blue-800 font-semibold text-sm">
                <ShoppingBag className="w-4.5 h-4.5" />
                <span>Manage Medicine Orders</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-blue-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <button 
              onClick={() => navigate('/settings')} 
              className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-left transition-colors duration-150 group cursor-pointer"
            >
              <div className="flex items-center gap-3 text-gray-800 font-semibold text-sm">
                <Settings className="w-4.5 h-4.5" />
                <span>Settings Console</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
