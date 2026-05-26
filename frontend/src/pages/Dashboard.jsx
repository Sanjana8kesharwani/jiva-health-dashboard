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

export default function Dashboard() {
  const navigate = useNavigate();
  const { users } = useStore();

  const totalUsers = users.length;
  const primeUsers = users.filter(u => u.isPrime).length;
  
  // Calculate active consultations count as sum of user appointments
  const activeConsultations = users.reduce((sum, u) => sum + (u.appointmentsCount || 0), 0);
  
  // Calculate pending orders dynamically from mapped user orders
  const pendingOrders = users.reduce((sum, u) => {
    const userPending = u.orders?.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length || 0;
    return sum + userPending;
  }, 0);

  // Compile dynamic recent activities from real database collections
  const recentActivities = [];

  if (users.length > 0) {
    const latestUser = [...users].sort((a, b) => new Date(b.joinedDate) - new Date(a.joinedDate))[0];
    recentActivities.push({
      id: 1,
      title: "New user registered",
      desc: `${latestUser.name} joined as a ${latestUser.role}`,
      time: "Recent"
    });
  }

  const allOrders = users.reduce((acc, u) => {
    return acc.concat((u.orders || []).map(o => ({ ...o, userName: u.name })));
  }, []);

  if (allOrders.length > 0) {
    const latestOrder = allOrders.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    recentActivities.push({
      id: 2,
      title: `Order ${latestOrder.status}`,
      desc: `Order of amount ₹${latestOrder.amount.toFixed(2)} is ${latestOrder.status.toLowerCase()}`,
      time: "Recent"
    });
  }

  const allPayments = users.reduce((acc, u) => {
    return acc.concat((u.payments || []).map(p => ({ ...p, userName: u.name })));
  }, []);

  if (allPayments.length > 0) {
    const latestPayment = allPayments.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    recentActivities.push({
      id: 3,
      title: "Payment Received",
      desc: `Received ₹${latestPayment.amount.toFixed(2)} from ${latestPayment.userName} via ${latestPayment.method}`,
      time: "Recent"
    });
  }

  // Fallback if collections are empty
  if (recentActivities.length === 0) {
    recentActivities.push({
      id: 4,
      title: "Clinic Console Active",
      desc: "System running. No database operations recorded yet.",
      time: "Now"
    });
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Welcome to Jiva Health</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Here is what's happening in your clinic today.</p>
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
          value={activeConsultations} 
          icon={Calendar} 
          iconBg="bg-emerald-50 text-emerald-600" 
        />
        <StatsCard 
          title="Pending Orders" 
          value={pendingOrders} 
          icon={ShoppingBag} 
          iconBg="bg-rose-50 text-rose-600" 
        />
      </div>

      {/* Dashboard Sub-grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Recent Activity */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-50 dark:border-slate-800 pb-4">
            <h3 className="font-bold text-gray-800 dark:text-slate-100">Recent System Activity</h3>
            <button 
              onClick={() => navigate('/users')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-0.5 cursor-pointer"
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
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-100 dark:bg-slate-800" aria-hidden="true" />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                          <Activity className="w-4 h-4" />
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{act.title}</p>
                          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{act.desc}</p>
                        </div>
                        <div className="text-right text-xs whitespace-nowrap text-gray-400 dark:text-slate-500">
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
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="font-bold text-gray-800 dark:text-slate-100 border-b border-gray-50 dark:border-slate-800 pb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-3.5">
            <button 
              onClick={() => navigate('/users?add=true')} 
              className="w-full flex items-center justify-between p-3.5 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100/80 dark:hover:bg-emerald-950/50 rounded-xl text-left transition-colors duration-150 group cursor-pointer text-emerald-800 dark:text-emerald-300 font-semibold text-sm"
            >
              <div className="flex items-center gap-3">
                <Plus className="w-4.5 h-4.5" />
                <span>Add Patient Account</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <button 
              onClick={() => navigate('/orders')} 
              className="w-full flex items-center justify-between p-3.5 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100/80 dark:hover:bg-blue-950/50 rounded-xl text-left transition-colors duration-150 group cursor-pointer text-blue-800 dark:text-blue-300 font-semibold text-sm"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4.5 h-4.5" />
                <span>Manage Medicine Orders</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-blue-600 dark:text-blue-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <button 
              onClick={() => navigate('/settings')} 
              className="w-full flex items-center justify-between p-3.5 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl text-left transition-colors duration-150 group cursor-pointer text-gray-800 dark:text-slate-200 font-semibold text-sm"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4.5 h-4.5" />
                <span>Settings Console</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-500 dark:text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
