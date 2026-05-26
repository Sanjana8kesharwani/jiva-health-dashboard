import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  UserMinus, 
  Crown, 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Check, 
  X,
  Power
} from 'lucide-react';
import { useStore } from '../store/useStore';
import StatsCard from '../components/StatsCard';
import CustomTable from '../components/CustomTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { Input, Select } from '../components/FormElements';

export default function UserManagement() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    users, 
    addUser, 
    updateUser, 
    toggleUserStatus, 
    upgradeUserToPrime,
    searchQuery,
    setSearchQuery
  } = useStore();

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Filters state
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, inactive

  // Form states
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Patient',
    gender: 'Female',
    dob: '',
    bloodGroup: 'O+',
    isPrime: false
  });

  const [formErrors, setFormErrors] = useState({});

  // Auto-open add modal if query param is set
  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      setIsAddOpen(true);
      // Clean query parameter after opening
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  // Dynamic Statistics
  const totalUsers = users.length;
  const primeUsers = users.filter(u => u.isPrime).length;
  const nonPrimeUsers = totalUsers - primeUsers;
  const totalFamilyMembers = users.reduce((sum, u) => sum + (u.familyMembers?.length || 0), 0);

  // Search & Filter list
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);

    const matchesFilter = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && user.status === 'Active') ||
      (statusFilter === 'inactive' && user.status === 'Inactive');

    return matchesSearch && matchesFilter;
  });

  // Handle Add User
  const handleOpenAddModal = () => {
    setFormValues({
      name: '',
      email: '',
      phone: '',
      role: 'Patient',
      gender: 'Female',
      dob: '',
      bloodGroup: 'O+',
      isPrime: false
    });
    setFormErrors({});
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formValues.name.trim()) errors.name = "Name is required";
    if (!formValues.email.trim()) errors.email = "Email is required";
    if (!formValues.phone.trim()) errors.phone = "Phone is required";
    if (!formValues.dob) errors.dob = "DOB is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    addUser(formValues);
    setIsAddOpen(false);
  };

  // Handle Edit User
  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setFormValues({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      gender: user.gender,
      dob: user.dob,
      bloodGroup: user.bloodGroup,
      isPrime: user.isPrime
    });
    setFormErrors({});
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formValues.name.trim()) errors.name = "Name is required";
    if (!formValues.email.trim()) errors.email = "Email is required";
    if (!formValues.phone.trim()) errors.phone = "Phone is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    updateUser(editingUser.id, formValues);
    setIsEditOpen(false);
  };

  // Table columns definition
  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shadow-sm">
            {row.avatar}
          </div>
          <div className="font-semibold text-gray-800 flex flex-col">
            <span className="flex items-center gap-1.5">
              {row.name}
              {row.isPrime && (
                <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" title="Prime Member" />
              )}
            </span>
            <span className="text-xs text-gray-400 font-normal">ID: #{row.id}</span>
          </div>
        </div>
      )
    },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { 
      key: 'role', 
      header: 'Role',
      render: (row) => <StatusBadge status={row.role} type="role" />
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />
    },
    { key: 'joinedDate', header: 'Joined Date' },
    { key: 'lastActive', header: 'Last Active' },
    { key: 'appointmentsCount', header: 'Appointments' },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          {/* View user details */}
          <button
            onClick={() => navigate(`/users/${row.id}`)}
            className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          {/* Edit user details */}
          <button
            onClick={() => handleOpenEditModal(row)}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
            title="Edit User"
          >
            <Edit className="w-4 h-4" />
          </button>

          {/* Toggle status */}
          <button
            onClick={() => toggleUserStatus(row.id)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              row.status === 'Active' 
                ? 'text-gray-400 hover:text-rose-600 hover:bg-rose-50' 
                : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
            }`}
            title={row.status === 'Active' ? 'Deactivate User' : 'Activate User'}
          >
            <Power className="w-4 h-4" />
          </button>

          {/* Upgrade to Prime */}
          {!row.isPrime && row.role === 'Patient' && (
            <button
              onClick={() => upgradeUserToPrime(row.id)}
              className="p-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg flex items-center gap-1 transition-colors px-2 py-1 ml-1 cursor-pointer"
              title="Upgrade to Prime"
            >
              <Crown className="w-3.5 h-3.5 fill-amber-500" />
              Upgrade
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header and Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and audit clinic patients, doctors, and system administrators.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all duration-150 transform hover:-translate-y-0.5 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Add User
        </button>
      </div>

      {/* Summary Cards */}
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
          icon={Crown} 
          iconBg="bg-amber-50 text-amber-600" 
          valueClass="text-amber-600"
        />
        <StatsCard 
          title="Non-Prime Users" 
          value={nonPrimeUsers} 
          icon={UserMinus} 
          iconBg="bg-gray-100 text-gray-600" 
        />
        <StatsCard 
          title="Total Family Members" 
          value={totalFamilyMembers} 
          icon={UserCheck} 
          iconBg="bg-purple-50 text-purple-600" 
          valueClass="text-emerald-600"
        />
      </div>

      {/* Filter and Search controls */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status filters */}
        <div className="flex items-center gap-1.5 bg-gray-50 p-1 rounded-xl w-full md:w-auto border border-gray-100">
          <button
            onClick={() => setStatusFilter('all')}
            className={`flex-1 md:flex-none px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              statusFilter === 'all' 
                ? 'bg-white text-gray-800 shadow-sm' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            All Users
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`flex-1 md:flex-none px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              statusFilter === 'active' 
                ? 'bg-white text-emerald-700 shadow-sm' 
                : 'text-gray-500 hover:text-emerald-700'
            }`}
          >
            Active Only
          </button>
          <button
            onClick={() => setStatusFilter('inactive')}
            className={`flex-1 md:flex-none px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              statusFilter === 'inactive' 
                ? 'bg-white text-rose-700 shadow-sm' 
                : 'text-gray-500 hover:text-rose-700'
            }`}
          >
            Inactive Only
          </button>
        </div>

        {/* Local Search input */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4.5 w-4.5 text-gray-400" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, email, phone..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-gray-700"
          />
        </div>
      </div>

      {/* Main Table view */}
      <CustomTable 
        columns={columns} 
        data={filteredUsers} 
        emptyMessage="No users match the search filter requirements."
      />

      {/* Add User Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add New User Account">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input 
            label="Full Name" 
            id="add-name"
            value={formValues.name}
            onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
            placeholder="Alice Williams"
            error={formErrors.name}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Email Address" 
              id="add-email"
              type="email"
              value={formValues.email}
              onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
              placeholder="alice@email.com"
              error={formErrors.email}
            />
            <Input 
              label="Phone Number" 
              id="add-phone"
              value={formValues.phone}
              onChange={(e) => setFormValues({ ...formValues, phone: e.target.value })}
              placeholder="+91 98765 43210"
              error={formErrors.phone}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Role"
              id="add-role"
              value={formValues.role}
              onChange={(e) => setFormValues({ ...formValues, role: e.target.value })}
              options={[
                { value: 'Patient', label: 'Patient' },
                { value: 'Doctor', label: 'Doctor' },
                { value: 'Admin', label: 'Admin' }
              ]}
            />
            <Select 
              label="Gender"
              id="add-gender"
              value={formValues.gender}
              onChange={(e) => setFormValues({ ...formValues, gender: e.target.value })}
              options={[
                { value: 'Female', label: 'Female' },
                { value: 'Male', label: 'Male' },
                { value: 'Other', label: 'Other' }
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Date of Birth" 
              id="add-dob"
              type="date"
              value={formValues.dob}
              onChange={(e) => setFormValues({ ...formValues, dob: e.target.value })}
              error={formErrors.dob}
            />
            <Select 
              label="Blood Group"
              id="add-blood"
              value={formValues.bloodGroup}
              onChange={(e) => setFormValues({ ...formValues, bloodGroup: e.target.value })}
              options={[
                { value: 'O+', label: 'O+' },
                { value: 'A+', label: 'A+' },
                { value: 'B+', label: 'B+' },
                { value: 'AB+', label: 'AB+' },
                { value: 'O-', label: 'O-' },
                { value: 'A-', label: 'A-' },
                { value: 'B-', label: 'B-' },
                { value: 'AB-', label: 'AB-' }
              ]}
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input 
              type="checkbox" 
              id="add-prime" 
              checked={formValues.isPrime}
              onChange={(e) => setFormValues({ ...formValues, isPrime: e.target.checked })}
              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
            />
            <label htmlFor="add-prime" className="text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer">
              Set as Prime Member
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit User Settings">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input 
            label="Full Name" 
            id="edit-name"
            value={formValues.name}
            onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
            placeholder="Alice Williams"
            error={formErrors.name}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Email Address" 
              id="edit-email"
              type="email"
              value={formValues.email}
              onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
              placeholder="alice@email.com"
              error={formErrors.email}
            />
            <Input 
              label="Phone Number" 
              id="edit-phone"
              value={formValues.phone}
              onChange={(e) => setFormValues({ ...formValues, phone: e.target.value })}
              placeholder="+91 98765 43210"
              error={formErrors.phone}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Role"
              id="edit-role"
              value={formValues.role}
              onChange={(e) => setFormValues({ ...formValues, role: e.target.value })}
              options={[
                { value: 'Patient', label: 'Patient' },
                { value: 'Doctor', label: 'Doctor' },
                { value: 'Admin', label: 'Admin' }
              ]}
            />
            <Select 
              label="Gender"
              id="edit-gender"
              value={formValues.gender}
              onChange={(e) => setFormValues({ ...formValues, gender: e.target.value })}
              options={[
                { value: 'Female', label: 'Female' },
                { value: 'Male', label: 'Male' },
                { value: 'Other', label: 'Other' }
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Date of Birth" 
              id="edit-dob"
              type="text"
              value={formValues.dob}
              onChange={(e) => setFormValues({ ...formValues, dob: e.target.value })}
              placeholder="e.g. 5/15/1990"
              error={formErrors.dob}
            />
            <Select 
              label="Blood Group"
              id="edit-blood"
              value={formValues.bloodGroup}
              onChange={(e) => setFormValues({ ...formValues, bloodGroup: e.target.value })}
              options={[
                { value: 'O+', label: 'O+' },
                { value: 'A+', label: 'A+' },
                { value: 'B+', label: 'B+' },
                { value: 'AB+', label: 'AB+' },
                { value: 'O-', label: 'O-' },
                { value: 'A-', label: 'A-' },
                { value: 'B-', label: 'B-' },
                { value: 'AB-', label: 'AB-' }
              ]}
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input 
              type="checkbox" 
              id="edit-prime" 
              checked={formValues.isPrime}
              onChange={(e) => setFormValues({ ...formValues, isPrime: e.target.checked })}
              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
            />
            <label htmlFor="edit-prime" className="text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer">
              Prime Membership
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
