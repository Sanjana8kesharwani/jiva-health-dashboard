import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Dashboard from '../pages/Dashboard';
import UserManagement from '../pages/UserManagement';
import UserDetail from '../pages/UserDetail';
import OrderDetail from '../pages/OrderDetail';
import PlaceholderPage from '../pages/Placeholders';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        {/* Redirect from root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Core Pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/users/:id" element={<UserDetail />} />
        <Route path="/orders" element={<OrderDetail />} /> {/* Acts as general orders view */}
        <Route path="/orders/:id" element={<OrderDetail />} />
        
        {/* Placeholder Routes */}
        <Route path="/organization" element={<PlaceholderPage title="Organization Management" />} />
        <Route path="/services" element={<PlaceholderPage title="Services Catalog" />} />
        <Route path="/services/consultation" element={<PlaceholderPage title="Doctor Consultations" />} />
        <Route path="/services/lab-tests" element={<PlaceholderPage title="Lab Testing" />} />
        <Route path="/services/medicines" element={<PlaceholderPage title="Medicine Catalog" />} />
        <Route path="/consultation" element={<PlaceholderPage title="Consultation Bookings" />} />
        <Route path="/lab-tests" element={<PlaceholderPage title="Lab test Booking" />} />
        <Route path="/ambulance" element={<PlaceholderPage title="Ambulance Booking" />} />
        <Route path="/vendors" element={<PlaceholderPage title="Vendor & Partners" />} />
        <Route path="/reports" element={<PlaceholderPage title="Reports & Analytics" />} />
        <Route path="/access" element={<PlaceholderPage title="User Access Controls" />} />
        <Route path="/settings" element={<PlaceholderPage title="System Settings" />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
