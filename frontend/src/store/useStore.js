import { create } from 'zustand';
import api from '../services/api';

export const useStore = create((set, get) => ({
  users: [],
  token: localStorage.getItem('token') || null,
  currentUser: JSON.parse(localStorage.getItem('user')) || null,
  loading: false,
  error: null,
  darkMode: localStorage.getItem('darkMode') === 'true',
  notifications: [],
  searchQuery: '',
  statusFilter: 'all', // 'all', 'active', 'inactive'

  // Authentication Actions
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/api/auth/login', { email, password });  
      const { token, ...userData } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      set({ 
        token, 
        currentUser: userData, 
        loading: false 
      });
      
      // Load app data upon successful login
      await get().fetchData();
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      set({ error: message, loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ 
      token: null, 
      currentUser: null, 
      users: [] 
    });
  },

  // Fetch all users, orders, and payments and merge them
  fetchData: async () => {
    if (!get().token) return;
    set({ loading: true, error: null });
    try {
      const [usersRes, ordersRes, paymentsRes] = await Promise.all([
        api.get('/users'),
        api.get('/orders'),
        api.get('/payments')
      ]);

      const rawUsers = usersRes.data.data || [];
      const rawOrders = ordersRes.data.data || [];
      const rawPayments = paymentsRes.data.data || [];

      // Map backend database objects to frontend-expected keys
      const mappedUsers = rawUsers.map(user => {
        // Find orders belonging to this user
        const userOrders = rawOrders
          .filter(o => o.userId === user._id || (o.userId && o.userId._id === user._id))
          .map(o => ({
            id: o._id,
            date: new Date(o.createdAt).toLocaleDateString('en-US'),
            items: o.orderItems || [],
            amount: o.totalAmount || 0,
            status: o.orderStatus || 'Pending',
            shippingAddress: o.shippingAddress 
              ? `${o.shippingAddress.addressLine}, ${o.shippingAddress.city}, ${o.shippingAddress.state} ${o.shippingAddress.pincode}`
              : '',
            paymentInfo: o.paymentMethod || '',
            deliveryStatus: o.orderStatus === 'Delivered' 
              ? `Delivered successfully on ${o.deliveredAt ? new Date(o.deliveredAt).toLocaleDateString('en-US') : new Date().toLocaleDateString('en-US')}`
              : `Status: ${o.orderStatus}`
          }));

        // Find payments belonging to this user
        const userPayments = rawPayments
          .filter(p => p.userId === user._id || (p.userId && p.userId._id === user._id))
          .map(p => ({
            id: p.paymentId || p._id,
            date: new Date(p.transactionDate || p.createdAt).toLocaleDateString('en-US'),
            amount: p.amount || 0,
            method: p.method || '',
            status: p.status === 'Completed' ? 'Success' : p.status || 'Pending'
          }));

        // Map addresses
        const mappedAddresses = (user.addresses || []).map(addr => ({
          id: addr._id,
          type: addr.type || 'Home',
          isDefault: addr.isDefault || false,
          street: addr.addressLine || '',
          city: addr.city || '',
          state: addr.state || '',
          zip: addr.pincode || '',
          country: 'India'
        }));

        // Map family members
        const mappedFamily = (user.familyMembers || []).map(fm => ({
          id: fm._id,
          name: fm.name || '',
          relationship: fm.relationship || '',
          dob: fm.dob ? new Date(fm.dob).toISOString().split('T')[0] : '',
          phone: fm.phone || ''
        }));

        // Compute initials for avatar fallback if not specified
        const initials = user.fullName
          ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
          : 'U';

        return {
          id: user._id,
          name: user.fullName,
          email: user.email,
          phone: user.phone || '',
          role: user.role || 'Patient',
          status: user.status || 'Active',
          joinedDate: new Date(user.joinedDate || user.createdAt).toLocaleDateString('en-US'),
          lastActive: new Date(user.lastActive || user.updatedAt).toLocaleDateString('en-US'),
          appointmentsCount: user.appointmentsCount || 0,
          isPrime: user.isPrime || false,
          gender: user.gender || 'Other',
          dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
          bloodGroup: user.bloodGroup || 'O+',
          avatar: user.avatar || initials,
          addresses: mappedAddresses,
          familyMembers: mappedFamily,
          orders: userOrders,
          payments: userPayments
        };
      });

      const newNotifications = [];
      if (mappedUsers.length > 0) {
        const latestUser = [...mappedUsers].sort((a, b) => new Date(b.joinedDate) - new Date(a.joinedDate))[0];
        newNotifications.push({ id: 1, text: `New user ${latestUser.name} registered`, read: false, time: 'Recent' });
      }

      const allOrders = mappedUsers.reduce((acc, u) => acc.concat((u.orders || []).map(o => ({ ...o, userName: u.name }))), []);
      if (allOrders.length > 0) {
        const latestOrder = allOrders.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        newNotifications.push({ id: 2, text: `Order ${latestOrder.status} for ${latestOrder.userName}`, read: false, time: 'Recent' });
      }

      const allPayments = mappedUsers.reduce((acc, u) => acc.concat((u.payments || []).map(p => ({ ...p, userName: u.name }))), []);
      if (allPayments.length > 0) {
        const latestPayment = allPayments.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        newNotifications.push({ id: 3, text: `Payment of ₹${latestPayment.amount} received from ${latestPayment.userName}`, read: false, time: 'Recent' });
      }

      if (newNotifications.length === 0) {
        newNotifications.push({ id: 1, text: "System is online and tracking", read: false, time: "Now" });
      }

      set({ users: mappedUsers, notifications: newNotifications, loading: false });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to sync with dashboard server.', 
        loading: false 
      });
    }
  },

  // User Management Actions
  addUser: async (user) => {
    set({ loading: true, error: null });
    try {
      const payload = {
        fullName: user.name,
        email: user.email,
        phone: user.phone,
        password: 'password123', // Default credentials for manual entries
        role: user.role || 'Patient',
        gender: user.gender || 'Other',
        dob: user.dob || undefined,
        bloodGroup: user.bloodGroup || 'O+',
        isPrime: user.isPrime || false
      };
      await api.post('/users', payload);
      await get().fetchData(); // Sync store with db
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to add user.', 
        loading: false 
      });
    }
  },

  updateUser: async (userId, updatedFields) => {
    set({ loading: true, error: null });
    try {
      const payload = { ...updatedFields };
      if (updatedFields.name) {
        payload.fullName = updatedFields.name;
        delete payload.name;
      }
      await api.put(`/users/${userId}`, payload);
      await get().fetchData();
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update user profile.', 
        loading: false 
      });
    }
  },

  deleteUser: async (userId) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/users/${userId}`);
      await get().fetchData();
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete user.', 
        loading: false 
      });
    }
  },

  toggleUserStatus: async (userId) => {
    try {
      await api.patch(`/users/${userId}/status`);
      await get().fetchData();
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to toggle status.' });
    }
  },

  upgradeUserToPrime: async (userId) => {
    try {
      await api.patch(`/users/${userId}/prime`, { isPrime: true });
      await get().fetchData();
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to upgrade user.' });
    }
  },

  // Address Actions
  addAddress: async (userId, address) => {
    try {
      const payload = {
        type: address.type,
        addressLine: address.street,
        city: address.city,
        state: address.state,
        pincode: address.zip,
        isDefault: address.isDefault || false
      };
      await api.post(`/users/${userId}/addresses`, payload);
      await get().fetchData();
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to add address.' });
    }
  },

  editAddress: async (userId, addressId, address) => {
    try {
      const payload = {
        type: address.type,
        addressLine: address.street,
        city: address.city,
        state: address.state,
        pincode: address.zip,
        isDefault: address.isDefault || false
      };
      await api.put(`/users/${userId}/addresses/${addressId}`, payload);
      await get().fetchData();
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update address.' });
    }
  },

  deleteAddress: async (userId, addressId) => {
    try {
      await api.delete(`/users/${userId}/addresses/${addressId}`);
      await get().fetchData();
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete address.' });
    }
  },

  // Family Member Actions
  addFamilyMember: async (userId, member) => {
    try {
      await api.post(`/users/${userId}/family`, member);
      await get().fetchData();
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to link family member.' });
    }
  },

  editFamilyMember: async (userId, memberId, member) => {
    try {
      await api.put(`/users/${userId}/family/${memberId}`, member);
      await get().fetchData();
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to edit family member.' });
    }
  },

  deleteFamilyMember: async (userId, memberId) => {
    try {
      await api.delete(`/users/${userId}/family/${memberId}`);
      await get().fetchData();
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to unlink family member.' });
    }
  },

  // UI State Actions
  toggleDarkMode: () => set((state) => {
    const nextMode = !state.darkMode;
    localStorage.setItem('darkMode', String(nextMode));
    return { darkMode: nextMode };
  }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (filter) => set({ statusFilter: filter }),
  markNotificationAsRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    )
  })),
  clearNotifications: () => set({ notifications: [] })
}));
