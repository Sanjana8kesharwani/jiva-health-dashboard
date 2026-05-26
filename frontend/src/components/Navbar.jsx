import React, { useState } from 'react';
import { Menu, Moon, Sun, Bell, Search, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Navbar({ toggleSidebar, isSidebarOpen }) {
  const { 
    searchQuery, 
    setSearchQuery, 
    darkMode, 
    toggleDarkMode, 
    notifications,
    markNotificationAsRead,
    currentUser
  } = useStore();

  const name = currentUser ? currentUser.fullName : 'Admin User';
  const avatarInitials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left side: panel toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 p-2 rounded-xl transition-colors cursor-pointer"
          title="Toggle Navigation Menu"
        >
          {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
        </button>
      </div>

      {/* Middle: Search bar */}
      <div className="flex-1 max-w-md mx-6">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4.5 w-4.5 text-gray-400" />
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50/70 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder-gray-400 dark:placeholder-slate-500 text-gray-800 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Right side: dark mode, notification, avatar */}
      <div className="flex items-center gap-3">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
          title="Toggle Theme"
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2.5 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 py-2 z-50 transform origin-top-right transition-all">
                <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="font-semibold text-sm text-gray-800 dark:text-slate-100">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full font-medium">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-gray-50 dark:divide-slate-800">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        onClick={() => {
                          markNotificationAsRead(notif.id);
                        }}
                        className={`p-3 text-left hover:bg-gray-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer flex items-start gap-2.5 ${
                          !notif.read ? 'bg-emerald-50/20 dark:bg-emerald-950/10' : ''
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                          !notif.read ? 'bg-emerald-500' : 'bg-transparent'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-700 dark:text-slate-300 font-medium leading-relaxed break-words">
                            {notif.text}
                          </p>
                          <span className="text-[10px] text-gray-400 dark:text-slate-500 mt-1 block">
                            {notif.time}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-xs text-gray-400 dark:text-slate-500">
                      No notifications
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="w-9 h-9 rounded-full bg-teal-900 flex items-center justify-center text-white text-xs font-bold shadow-sm select-none">
          {avatarInitials}
        </div>
      </div>
    </header>
  );
}
