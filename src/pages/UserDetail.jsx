import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Crown, 
  Calendar, 
  Activity, 
  ShoppingBag, 
  Stethoscope, 
  CreditCard, 
  Mail, 
  Phone, 
  User, 
  Droplet, 
  Edit, 
  Plus, 
  Trash2, 
  Home, 
  MapPin, 
  Users, 
  Eye 
} from 'lucide-react';
import { useStore } from '../store/useStore';
import StatsCard from '../components/StatsCard';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { Input, Select } from '../components/FormElements';
import CustomTable from '../components/CustomTable';

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    users, 
    updateUser, 
    toggleUserStatus, 
    upgradeUserToPrime,
    addAddress,
    editAddress,
    deleteAddress,
    addFamilyMember,
    editFamilyMember,
    deleteFamilyMember
  } = useStore();

  const user = users.find((u) => u.id === id);

  // Tabs state: 'overview', 'orders', 'payments', 'family'
  const [activeTab, setActiveTab] = useState('overview');

  // Modal open states
  const [isEditInfoOpen, setIsEditInfoOpen] = useState(false);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);
  const [isAddFamilyOpen, setIsAddFamilyOpen] = useState(false);
  const [isEditFamilyOpen, setIsEditFamilyOpen] = useState(false);

  // Selected sub-records for edits
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState(null);

  // Form states
  const [personalInfoValues, setPersonalInfoValues] = useState({
    email: '',
    phone: '',
    dob: '',
    gender: 'Female',
    bloodGroup: 'O+'
  });

  const [addressValues, setAddressValues] = useState({
    type: 'Home',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
    isDefault: false
  });

  const [familyValues, setFamilyValues] = useState({
    name: '',
    relationship: 'Spouse',
    dob: '',
    phone: ''
  });

  const [formErrors, setFormErrors] = useState({});

  if (!user) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800">User Not Found</h3>
        <p className="text-sm text-gray-500 mt-1">The user ID you requested does not exist.</p>
        <Link to="/users" className="mt-4 inline-flex items-center gap-2 text-sm text-emerald-600 font-semibold hover:text-emerald-700">
          <ArrowLeft className="w-4 h-4" /> Back to User Management
        </Link>
      </div>
    );
  }

  // Calculate dynamic metrics
  const totalOrdersCount = user.orders?.length || 0;
  const bookingsCount = user.appointmentsCount || 0;
  const familyCount = user.familyMembers?.length || 0;
  const totalSpentAmount = user.payments
    ?.filter((p) => p.status === 'Success')
    .reduce((sum, p) => sum + p.amount, 0) || 0;

  // Personal Info edit submit
  const handleOpenEditInfo = () => {
    setPersonalInfoValues({
      email: user.email,
      phone: user.phone,
      dob: user.dob,
      gender: user.gender,
      bloodGroup: user.bloodGroup
    });
    setFormErrors({});
    setIsEditInfoOpen(true);
  };

  const handleEditInfoSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!personalInfoValues.email.trim()) errors.email = "Email is required";
    if (!personalInfoValues.phone.trim()) errors.phone = "Phone is required";
    if (!personalInfoValues.dob.trim()) errors.dob = "DOB is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    updateUser(user.id, personalInfoValues);
    setIsEditInfoOpen(false);
  };

  // Address CRUD
  const handleOpenAddAddress = () => {
    setAddressValues({
      type: 'Home',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'India',
      isDefault: false
    });
    setFormErrors({});
    setIsAddAddressOpen(true);
  };

  const handleAddAddressSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!addressValues.street.trim()) errors.street = "Street address is required";
    if (!addressValues.city.trim()) errors.city = "City is required";
    if (!addressValues.state.trim()) errors.state = "State is required";
    if (!addressValues.zip.trim()) errors.zip = "ZIP/Postal Code is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    addAddress(user.id, addressValues);
    setIsAddAddressOpen(false);
  };

  const handleOpenEditAddress = (addr) => {
    setSelectedAddress(addr);
    setAddressValues({
      type: addr.type,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      zip: addr.zip,
      country: addr.country,
      isDefault: addr.isDefault
    });
    setFormErrors({});
    setIsEditAddressOpen(true);
  };

  const handleEditAddressSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!addressValues.street.trim()) errors.street = "Street address is required";
    if (!addressValues.city.trim()) errors.city = "City is required";
    if (!addressValues.state.trim()) errors.state = "State is required";
    if (!addressValues.zip.trim()) errors.zip = "ZIP/Postal Code is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    editAddress(user.id, selectedAddress.id, addressValues);
    setIsEditAddressOpen(false);
  };

  // Family member CRUD
  const handleOpenAddFamily = () => {
    setFamilyValues({
      name: '',
      relationship: 'Spouse',
      dob: '',
      phone: ''
    });
    setFormErrors({});
    setIsAddFamilyOpen(true);
  };

  const handleAddFamilySubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!familyValues.name.trim()) errors.name = "Name is required";
    if (!familyValues.dob) errors.dob = "DOB is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    addFamilyMember(user.id, familyValues);
    setIsAddFamilyOpen(false);
  };

  const handleOpenEditFamily = (fm) => {
    setSelectedFamilyMember(fm);
    setFamilyValues({
      name: fm.name,
      relationship: fm.relationship,
      dob: fm.dob,
      phone: fm.phone || ''
    });
    setFormErrors({});
    setIsEditFamilyOpen(true);
  };

  const handleEditFamilySubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!familyValues.name.trim()) errors.name = "Name is required";
    if (!familyValues.dob) errors.dob = "DOB is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    editFamilyMember(user.id, selectedFamilyMember.id, familyValues);
    setIsEditFamilyOpen(false);
  };

  // Tab rendering helper
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                  <h3 className="font-bold text-gray-800">Personal Information</h3>
                  <button
                    onClick={handleOpenEditInfo}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer text-gray-600"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <span className="text-xs text-gray-400 block">Email:</span>
                      <span className="font-medium text-gray-700 truncate block">{user.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-gray-400 block">Phone:</span>
                      <span className="font-medium text-gray-700">{user.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-gray-400 block">Date of Birth:</span>
                      <span className="font-medium text-gray-700">{user.dob}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-gray-400 block">Gender:</span>
                      <span className="font-medium text-gray-700">{user.gender}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Droplet className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-gray-400 block">Blood Group:</span>
                      <span className="font-medium text-gray-700">{user.bloodGroup}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Addresses section */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                <h3 className="font-bold text-gray-800">Addresses</h3>
                <button
                  onClick={handleOpenAddAddress}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer text-gray-600"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>

              {user.addresses && user.addresses.length > 0 ? (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {user.addresses.map((addr) => (
                    <div 
                      key={addr.id} 
                      className="p-4 bg-gray-50/70 border border-gray-100 rounded-xl flex items-start justify-between gap-4"
                    >
                      <div className="flex gap-3">
                        <div className="mt-1 p-2 bg-emerald-50 rounded-lg text-emerald-600">
                          {addr.type === 'Home' ? <Home className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                        </div>
                        <div className="text-sm">
                          <span className="font-semibold text-gray-800 flex items-center gap-2">
                            {addr.type}
                            {addr.isDefault && (
                              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-gray-200 text-gray-700 rounded-md">
                                Default
                              </span>
                            )}
                          </span>
                          <p className="text-gray-500 mt-1.5 leading-relaxed whitespace-pre-line">
                            {addr.street}, {addr.city}, {addr.state} {addr.zip}, {addr.country}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditAddress(addr)}
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-white rounded border border-transparent hover:border-gray-200 transition-all cursor-pointer"
                          title="Edit Address"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteAddress(user.id, addr.id)}
                          className="p-1 text-gray-400 hover:text-rose-600 hover:bg-white rounded border border-transparent hover:border-gray-200 transition-all cursor-pointer"
                          title="Delete Address"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 text-xs">
                  No addresses added yet. Click Add to insert one.
                </div>
              )}
            </div>
          </div>
        );

      case 'orders':
        const orderCols = [
          { 
            key: 'id', 
            header: 'Order ID',
            render: (row) => <span className="font-semibold text-gray-800">{row.id}</span>
          },
          { key: 'date', header: 'Date' },
          { 
            key: 'items', 
            header: 'Items',
            render: (row) => (
              <span className="truncate max-w-[200px] block" title={row.items.map(i => `${i.name} (${i.quantity}x)`).join(', ')}>
                {row.items.map(i => `${i.name} (${i.quantity}x)`).join(', ')}
              </span>
            )
          },
          { 
            key: 'amount', 
            header: 'Amount',
            render: (row) => <span className="font-semibold text-gray-800">₹{row.amount.toFixed(2)}</span>
          },
          { 
            key: 'status', 
            header: 'Status',
            render: (row) => <StatusBadge status={row.status} />
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
              <button
                onClick={() => navigate(`/orders/${row.id}`)}
                className="p-1 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                title="View Receipt"
              >
                <Eye className="w-4 h-4" />
              </button>
            )
          }
        ];
        return (
          <CustomTable 
            columns={orderCols} 
            data={user.orders} 
            emptyMessage="No medicine orders made by this user." 
          />
        );

      case 'payments':
        const paymentCols = [
          { 
            key: 'id', 
            header: 'Payment ID',
            render: (row) => <span className="font-semibold text-gray-800">{row.id}</span>
          },
          { key: 'date', header: 'Date' },
          { 
            key: 'amount', 
            header: 'Amount',
            render: (row) => <span className="font-semibold text-gray-800">₹{row.amount.toFixed(2)}</span>
          },
          { key: 'method', header: 'Method' },
          { 
            key: 'status', 
            header: 'Status',
            render: (row) => <StatusBadge status={row.status} />
          }
        ];
        return (
          <CustomTable 
            columns={paymentCols} 
            data={user.payments} 
            emptyMessage="No payments found for this user." 
          />
        );

      case 'family':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-800">Family Members ({familyCount})</h3>
              <button
                onClick={handleOpenAddFamily}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Member
              </button>
            </div>

            {user.familyMembers && user.familyMembers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {user.familyMembers.map((member) => (
                  <div 
                    key={member.id}
                    className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-200 relative group"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs">
                        {member.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-gray-800 text-sm">{member.name}</h4>
                        <span className="inline-block px-2 py-0.5 text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-100 rounded-full">
                          {member.relationship}
                        </span>
                        <div className="text-xs text-gray-500 pt-1 space-y-0.5">
                          <p>DOB: {member.dob}</p>
                          <p>Phone: {member.phone || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenEditFamily(member)}
                        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-gray-50 rounded transition-all cursor-pointer border border-transparent hover:border-gray-200"
                        title="Edit Member"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteFamilyMember(user.id, member.id)}
                        className="p-1 text-gray-400 hover:text-rose-600 hover:bg-gray-50 rounded transition-all cursor-pointer border border-transparent hover:border-gray-200"
                        title="Delete Member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm text-gray-400 text-sm">
                No family members linked to this profile. Click "Add Member" to link family.
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Back link */}
      <div>
        <Link 
          to="/users" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to User Management
        </Link>
      </div>

      {/* Profile Header section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4.5">
          {/* Avatar Circle */}
          <div className="w-16 h-16 rounded-full bg-[#b2e5d9] text-[#137333] flex items-center justify-center font-bold text-xl shadow-sm border border-emerald-100 flex-shrink-0">
            {user.avatar}
          </div>
          
          {/* User names and badges */}
          <div className="space-y-1.5">
            <h1 className="text-xl font-bold text-gray-800 leading-tight">{user.name}</h1>
            <div className="flex flex-wrap items-center gap-1.5">
              <StatusBadge status={user.status} />
              <StatusBadge status={user.role} type="role" />
              <StatusBadge status={user.isPrime ? 'Prime User' : 'Normal User'} type="user-type" />
              <span className="text-xs text-gray-400 font-semibold ml-1">ID: #{user.id}</span>
            </div>
            
            {/* Logs */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1.5 text-xs text-gray-400 font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                Joined {user.joinedDate}
              </span>
              <span className="flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-gray-400" />
                Last active {user.lastActive}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons right */}
        <div className="flex items-center gap-3 self-start md:self-center">
          {!user.isPrime && user.role === 'Patient' && (
            <button
              onClick={() => upgradeUserToPrime(user.id)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-xl shadow-md transition-all duration-150 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Crown className="w-4 h-4 text-white fill-white" />
              Upgrade to Prime
            </button>
          )}

          {/* Status dropdown */}
          <select
            value={user.status}
            onChange={() => toggleUserStatus(user.id)}
            className="px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[right_0.5rem_center] bg-[length:1.25rem_1.25rem] bg-no-repeat pr-9"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard 
          title="Total Orders" 
          value={totalOrdersCount} 
          icon={ShoppingBag} 
          iconBg="bg-blue-50 text-blue-600" 
        />
        <StatsCard 
          title="Total Booking & Appointment" 
          value={bookingsCount} 
          icon={Stethoscope} 
          iconBg="bg-emerald-50 text-emerald-600" 
          valueClass="text-emerald-600"
        />
        <StatsCard 
          title="Total Family Member" 
          value={familyCount} 
          iconBg="bg-transparent text-transparent" /* No icon block matching UI */
          valueClass="text-emerald-600"
        />
        <StatsCard 
          title="Total Spent" 
          value={`₹${totalSpentAmount.toFixed(2)}`} 
          icon={CreditCard} 
          iconBg="bg-emerald-50 text-emerald-600" 
        />
      </div>

      {/* Sub tabs navigator */}
      <div className="border-b border-gray-100 flex items-center gap-6 overflow-x-auto text-sm font-medium">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-1 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'overview' 
              ? 'border-emerald-600 text-emerald-700 font-semibold' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <User className="w-4.5 h-4.5" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3 px-1 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'orders' 
              ? 'border-emerald-600 text-emerald-700 font-semibold' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <ShoppingBag className="w-4.5 h-4.5" />
          Orders & Bookings
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`py-3 px-1 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'payments' 
              ? 'border-emerald-600 text-emerald-700 font-semibold' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <CreditCard className="w-4.5 h-4.5" />
          Payments
        </button>
        <button
          onClick={() => setActiveTab('family')}
          className={`py-3 px-1 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'family' 
              ? 'border-emerald-600 text-emerald-700 font-semibold' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users className="w-4.5 h-4.5" />
          Family Members
        </button>
      </div>

      {/* Tab panel Outlet */}
      <div className="pt-2">
        {renderTabContent()}
      </div>

      {/* MODAL 1: Edit Personal Information */}
      <Modal isOpen={isEditInfoOpen} onClose={() => setIsEditInfoOpen(false)} title="Edit Personal Information">
        <form onSubmit={handleEditInfoSubmit} className="space-y-4">
          <Input 
            label="Email Address" 
            id="edit-info-email"
            type="email"
            value={personalInfoValues.email}
            onChange={(e) => setPersonalInfoValues({ ...personalInfoValues, email: e.target.value })}
            error={formErrors.email}
          />
          <Input 
            label="Phone Number" 
            id="edit-info-phone"
            value={personalInfoValues.phone}
            onChange={(e) => setPersonalInfoValues({ ...personalInfoValues, phone: e.target.value })}
            error={formErrors.phone}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Date of Birth" 
              id="edit-info-dob"
              value={personalInfoValues.dob}
              onChange={(e) => setPersonalInfoValues({ ...personalInfoValues, dob: e.target.value })}
              placeholder="e.g. 5/15/1990"
              error={formErrors.dob}
            />
            <Select 
              label="Blood Group"
              id="edit-info-blood"
              value={personalInfoValues.bloodGroup}
              onChange={(e) => setPersonalInfoValues({ ...personalInfoValues, bloodGroup: e.target.value })}
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
          <Select 
            label="Gender"
            id="edit-info-gender"
            value={personalInfoValues.gender}
            onChange={(e) => setPersonalInfoValues({ ...personalInfoValues, gender: e.target.value })}
            options={[
              { value: 'Female', label: 'Female' },
              { value: 'Male', label: 'Male' },
              { value: 'Other', label: 'Other' }
            ]}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsEditInfoOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Save Details
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: Add Address */}
      <Modal isOpen={isAddAddressOpen} onClose={() => setIsAddAddressOpen(false)} title="Add Address Record">
        <form onSubmit={handleAddAddressSubmit} className="space-y-4">
          <Select 
            label="Address Designation"
            id="add-addr-type"
            value={addressValues.type}
            onChange={(e) => setAddressValues({ ...addressValues, type: e.target.value })}
            options={[
              { value: 'Home', label: 'Home' },
              { value: 'Work', label: 'Work' }
            ]}
          />
          <Input 
            label="Street & Area Details" 
            id="add-addr-street"
            value={addressValues.street}
            onChange={(e) => setAddressValues({ ...addressValues, street: e.target.value })}
            placeholder="Flat 301, Sunshine Apartments, MG Road"
            error={formErrors.street}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="City" 
              id="add-addr-city"
              value={addressValues.city}
              onChange={(e) => setAddressValues({ ...addressValues, city: e.target.value })}
              placeholder="Mumbai"
              error={formErrors.city}
            />
            <Input 
              label="State" 
              id="add-addr-state"
              value={addressValues.state}
              onChange={(e) => setAddressValues({ ...addressValues, state: e.target.value })}
              placeholder="Maharashtra"
              error={formErrors.state}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="ZIP / Postal Code" 
              id="add-addr-zip"
              value={addressValues.zip}
              onChange={(e) => setAddressValues({ ...addressValues, zip: e.target.value })}
              placeholder="400001"
              error={formErrors.zip}
            />
            <Input 
              label="Country" 
              id="add-addr-country"
              value={addressValues.country}
              onChange={(e) => setAddressValues({ ...addressValues, country: e.target.value })}
              placeholder="India"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input 
              type="checkbox" 
              id="add-addr-default" 
              checked={addressValues.isDefault}
              onChange={(e) => setAddressValues({ ...addressValues, isDefault: e.target.checked })}
              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
            />
            <label htmlFor="add-addr-default" className="text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer">
              Set as default shipping address
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsAddAddressOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Save Address
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: Edit Address */}
      <Modal isOpen={isEditAddressOpen} onClose={() => setIsEditAddressOpen(false)} title="Edit Address Record">
        <form onSubmit={handleEditAddressSubmit} className="space-y-4">
          <Select 
            label="Address Designation"
            id="edit-addr-type"
            value={addressValues.type}
            onChange={(e) => setAddressValues({ ...addressValues, type: e.target.value })}
            options={[
              { value: 'Home', label: 'Home' },
              { value: 'Work', label: 'Work' }
            ]}
          />
          <Input 
            label="Street & Area Details" 
            id="edit-addr-street"
            value={addressValues.street}
            onChange={(e) => setAddressValues({ ...addressValues, street: e.target.value })}
            error={formErrors.street}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="City" 
              id="edit-addr-city"
              value={addressValues.city}
              onChange={(e) => setAddressValues({ ...addressValues, city: e.target.value })}
              error={formErrors.city}
            />
            <Input 
              label="State" 
              id="edit-addr-state"
              value={addressValues.state}
              onChange={(e) => setAddressValues({ ...addressValues, state: e.target.value })}
              error={formErrors.state}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="ZIP / Postal Code" 
              id="edit-addr-zip"
              value={addressValues.zip}
              onChange={(e) => setAddressValues({ ...addressValues, zip: e.target.value })}
              error={formErrors.zip}
            />
            <Input 
              label="Country" 
              id="edit-addr-country"
              value={addressValues.country}
              onChange={(e) => setAddressValues({ ...addressValues, country: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input 
              type="checkbox" 
              id="edit-addr-default" 
              checked={addressValues.isDefault}
              onChange={(e) => setAddressValues({ ...addressValues, isDefault: e.target.checked })}
              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
            />
            <label htmlFor="edit-addr-default" className="text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer">
              Set as default shipping address
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsEditAddressOpen(false)}
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

      {/* MODAL 4: Add Family Member */}
      <Modal isOpen={isAddFamilyOpen} onClose={() => setIsAddFamilyOpen(false)} title="Link Family Member">
        <form onSubmit={handleAddFamilySubmit} className="space-y-4">
          <Input 
            label="Full Name" 
            id="add-fm-name"
            value={familyValues.name}
            onChange={(e) => setFamilyValues({ ...familyValues, name: e.target.value })}
            placeholder="John Williams"
            error={formErrors.name}
          />
          <Select 
            label="Relationship"
            id="add-fm-relationship"
            value={familyValues.relationship}
            onChange={(e) => setFamilyValues({ ...familyValues, relationship: e.target.value })}
            options={[
              { value: 'Spouse', label: 'Spouse' },
              { value: 'Son', label: 'Son' },
              { value: 'Daughter', label: 'Daughter' },
              { value: 'Father', label: 'Father' },
              { value: 'Mother', label: 'Mother' },
              { value: 'Sister', label: 'Sister' },
              { value: 'Brother', label: 'Brother' },
              { value: 'Grandfather', label: 'Grandfather' },
              { value: 'Grandmother', label: 'Grandmother' },
              { value: 'Uncle', label: 'Uncle' }
            ]}
          />
          <Input 
            label="Date of Birth" 
            id="add-fm-dob"
            type="date"
            value={familyValues.dob}
            onChange={(e) => setFamilyValues({ ...familyValues, dob: e.target.value })}
            error={formErrors.dob}
          />
          <Input 
            label="Phone Number (Optional)" 
            id="add-fm-phone"
            value={familyValues.phone}
            onChange={(e) => setFamilyValues({ ...familyValues, phone: e.target.value })}
            placeholder="+91 98765 43211"
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsAddFamilyOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Link Member
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 5: Edit Family Member */}
      <Modal isOpen={isEditFamilyOpen} onClose={() => setIsEditFamilyOpen(false)} title="Edit Family Link">
        <form onSubmit={handleEditFamilySubmit} className="space-y-4">
          <Input 
            label="Full Name" 
            id="edit-fm-name"
            value={familyValues.name}
            onChange={(e) => setFamilyValues({ ...familyValues, name: e.target.value })}
            error={formErrors.name}
          />
          <Select 
            label="Relationship"
            id="edit-fm-relationship"
            value={familyValues.relationship}
            onChange={(e) => setFamilyValues({ ...familyValues, relationship: e.target.value })}
            options={[
              { value: 'Spouse', label: 'Spouse' },
              { value: 'Son', label: 'Son' },
              { value: 'Daughter', label: 'Daughter' },
              { value: 'Father', label: 'Father' },
              { value: 'Mother', label: 'Mother' },
              { value: 'Sister', label: 'Sister' },
              { value: 'Brother', label: 'Brother' },
              { value: 'Grandfather', label: 'Grandfather' },
              { value: 'Grandmother', label: 'Grandmother' },
              { value: 'Uncle', label: 'Uncle' }
            ]}
          />
          <Input 
            label="Date of Birth" 
            id="edit-fm-dob"
            type="text"
            value={familyValues.dob}
            onChange={(e) => setFamilyValues({ ...familyValues, dob: e.target.value })}
            placeholder="YYYY-MM-DD"
            error={formErrors.dob}
          />
          <Input 
            label="Phone Number" 
            id="edit-fm-phone"
            value={familyValues.phone}
            onChange={(e) => setFamilyValues({ ...familyValues, phone: e.target.value })}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsEditFamilyOpen(false)}
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
