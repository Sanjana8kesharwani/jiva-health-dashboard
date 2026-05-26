import { create } from 'zustand';
import { initialUsers } from '../data/dummyData';

export const useStore = create((set) => ({
  users: initialUsers,
  darkMode: false,
  notifications: [
    { id: 1, text: "New appointment request from Alice Williams", read: false, time: "5 mins ago" },
    { id: 2, text: "Medicine order ORD-92837 delivered", read: true, time: "1 hour ago" },
    { id: 3, text: "Lab report ready for Bob Smith", read: false, time: "3 hours ago" }
  ],
  searchQuery: '',
  statusFilter: 'all', // 'all', 'active', 'inactive'

  // User Actions
  addUser: (user) => set((state) => {
    const newId = String(state.users.length + 1);
    const initials = user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newUser = {
      id: newId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role || 'Patient',
      status: 'Active',
      joinedDate: new Date().toLocaleDateString('en-US'),
      lastActive: new Date().toLocaleDateString('en-US'),
      appointmentsCount: 0,
      isPrime: user.isPrime || false,
      gender: user.gender || 'Other',
      dob: user.dob || '',
      bloodGroup: user.bloodGroup || 'O+',
      avatar: initials,
      addresses: [],
      familyMembers: [],
      orders: [],
      payments: []
    };
    return { users: [...state.users, newUser] };
  }),

  updateUser: (userId, updatedFields) => set((state) => ({
    users: state.users.map((user) =>
      user.id === userId ? { ...user, ...updatedFields } : user
    )
  })),

  deleteUser: (userId) => set((state) => ({
    users: state.users.filter((user) => user.id !== userId)
  })),

  toggleUserStatus: (userId) => set((state) => ({
    users: state.users.map((user) =>
      user.id === userId
        ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active', lastActive: new Date().toLocaleDateString('en-US') }
        : user
    )
  })),

  upgradeUserToPrime: (userId) => set((state) => ({
    users: state.users.map((user) =>
      user.id === userId ? { ...user, isPrime: true } : user
    )
  })),

  // Address Actions
  addAddress: (userId, address) => set((state) => ({
    users: state.users.map((user) => {
      if (user.id !== userId) return user;
      
      const newAddress = {
        id: `addr-${Date.now()}`,
        ...address,
        isDefault: user.addresses.length === 0 ? true : address.isDefault || false
      };

      // If this address is set to default, unset isDefault for other addresses
      const updatedAddresses = newAddress.isDefault
        ? user.addresses.map(a => ({ ...a, isDefault: false })).concat(newAddress)
        : [...user.addresses, newAddress];

      return { ...user, addresses: updatedAddresses };
    })
  })),

  editAddress: (userId, addressId, updatedAddress) => set((state) => ({
    users: state.users.map((user) => {
      if (user.id !== userId) return user;

      let updatedAddresses = user.addresses.map((addr) =>
        addr.id === addressId ? { ...addr, ...updatedAddress } : addr
      );

      // If the edited address was set to default, ensure no other address is default
      if (updatedAddress.isDefault) {
        updatedAddresses = updatedAddresses.map((addr) =>
          addr.id === addressId ? { ...addr, isDefault: true } : { ...addr, isDefault: false }
        );
      }

      return { ...user, addresses: updatedAddresses };
    })
  })),

  deleteAddress: (userId, addressId) => set((state) => ({
    users: state.users.map((user) => {
      if (user.id !== userId) return user;
      
      const targetAddress = user.addresses.find(a => a.id === addressId);
      const remainingAddresses = user.addresses.filter(a => a.id !== addressId);
      
      // If we deleted the default address and there are remaining addresses, set the first one as default
      if (targetAddress?.isDefault && remainingAddresses.length > 0) {
        remainingAddresses[0].isDefault = true;
      }
      
      return { ...user, addresses: remainingAddresses };
    })
  })),

  // Family Member Actions
  addFamilyMember: (userId, member) => set((state) => ({
    users: state.users.map((user) => {
      if (user.id !== userId) return user;
      const newMember = {
        id: `fm-${Date.now()}`,
        ...member
      };
      return { ...user, familyMembers: [...user.familyMembers, newMember] };
    })
  })),

  editFamilyMember: (userId, memberId, updatedMember) => set((state) => ({
    users: state.users.map((user) => {
      if (user.id !== userId) return user;
      return {
        ...user,
        familyMembers: user.familyMembers.map((m) =>
          m.id === memberId ? { ...m, ...updatedMember } : m
        )
      };
    })
  })),

  deleteFamilyMember: (userId, memberId) => set((state) => ({
    users: state.users.map((user) => {
      if (user.id !== userId) return user;
      return {
        ...user,
        familyMembers: user.familyMembers.filter((m) => m.id !== memberId)
      };
    })
  })),

  // UI State Actions
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setStatusFilter: (filter) => set({ statusFilter: filter }),

  markNotificationAsRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    )
  })),

  clearNotifications: () => set({ notifications: [] })
}));
