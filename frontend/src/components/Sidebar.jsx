import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Stethoscope, 
  Calendar, 
  FlaskConical, 
  Pill, 
  Truck, 
  Handshake, 
  FileText, 
  ShieldAlert, 
  Settings,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/organization', label: 'Organization', icon: Building2 },
  { path: '/users', label: 'User Management', icon: Users },
  { 
    label: 'Services', 
    icon: Stethoscope,
    isDropdown: true,
    subItems: [
      { path: '/services/consultation', label: 'Consultations' },
      { path: '/services/lab-tests', label: 'Lab Bookings' },
      { path: '/services/medicines', label: 'Medicine Orders' }
    ]
  },
  { path: '/consultation', label: 'Consultation', icon: Calendar },
  { path: '/lab-tests', label: 'Lab test Booking', icon: FlaskConical },
  { path: '/orders', label: 'Medicine Orders', icon: Pill },
  { path: '/ambulance', label: 'Ambulance booking', icon: Truck },
  { path: '/vendors', label: 'Vendor & Partners', icon: Handshake },
  { path: '/reports', label: 'Report', icon: FileText },
  { path: '/access', label: 'User Access', icon: ShieldAlert },
  { path: '/settings', label: 'Setting', icon: Settings },
];

export default function Sidebar({ isOpen, toggleSidebar }) {
  const [servicesExpanded, setServicesExpanded] = useState(false);

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/30 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col w-64 bg-white border-r border-gray-100 transition-transform duration-300 lg:static lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo Area */}
        <div className="h-16 px-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* SVG Logo approximating the actual Jiva Health logo style */}
            <svg viewBox="0 0 200 50" className="w-36 h-10 select-none">
              <path d="M12 25 C12 12, 28 12, 28 25 S44 38, 44 25" stroke="#10B981" strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M28 15 L28 35" stroke="#EF4444" strokeWidth="3" fill="none" />
              {/* Heartbeat spikes */}
              <path d="M18 25 L24 25 L27 10 L31 40 L34 22 L37 28 L43 25" stroke="#EF4444" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <text x="52" y="32" fontFamily="'Outfit', sans-serif" fontSize="24" fontWeight="800" fill="#10B981">
                Jiva
              </text>
              <text x="105" y="32" fontFamily="'Outfit', sans-serif" fontSize="24" fontWeight="400" fill="#EF4444">
                Health
              </text>
            </svg>
          </div>
          {/* Close button for mobile */}
          <button 
            onClick={toggleSidebar} 
            className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Items */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;

            if (item.isDropdown) {
              return (
                <div key={idx} className="space-y-1">
                  <button
                    onClick={() => setServicesExpanded(!servicesExpanded)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-600 rounded-xl transition-all hover:bg-gray-50 hover:text-gray-900 group`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                      <span>{item.label}</span>
                    </div>
                    {servicesExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  {servicesExpanded && (
                    <div className="pl-11 pr-2 space-y-1">
                      {item.subItems.map((sub) => (
                        <NavLink
                          key={sub.path}
                          to={sub.path}
                          className={({ isActive }) =>
                            `block px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                              isActive 
                                ? 'bg-emerald-50 text-emerald-700' 
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                            }`
                          }
                        >
                          {sub.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-150 group ${
                    isActive 
                      ? 'bg-emerald-50 text-emerald-700 font-semibold' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-600'
                    }`} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User profile card at bottom */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/40">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-10 h-10 rounded-full bg-teal-900 flex items-center justify-center text-white text-sm font-bold shadow-sm">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">Admin@healthcare.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
