
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Plus, Filter, MoreVertical, 
  Edit2, Trash2, X, Check,
  ChevronLeft, ChevronRight, Upload, AlertCircle
} from 'lucide-react';
import { MOCK_USERS, MOCK_ROLES, MOCK_WAREHOUSES } from '../constants';
import { User, Role } from '../types';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('benz_users');
    return saved ? JSON.parse(saved) : MOCK_USERS;
  });

  const [availableRoles, setAvailableRoles] = useState<Role[]>(() => {
    const saved = localStorage.getItem('benz_roles');
    return saved ? JSON.parse(saved) : MOCK_ROLES;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [itemsPerPage] = useState(10);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Sync users with localStorage
  useEffect(() => {
    localStorage.setItem('benz_users', JSON.stringify(users));
  }, [users]);

  // Reload roles on component mount to ensure new roles appear
  useEffect(() => {
    const savedRoles = localStorage.getItem('benz_roles');
    if (savedRoles) {
      setAvailableRoles(JSON.parse(savedRoles));
    }
  }, [showAddModal]);

  // Check if current user is Super Admin
  const currentUser = "BenzWebTech"; 
  const isSuperAdmin = currentUser === "BenzWebTech";

  // New User Form State
  const initialFormState = {
    username: '',
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: '',
    warehouse: '',
    profilePic: null as File | null
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      `${user.firstName} ${user.lastName} ${user.username}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check size < 500KB
      if (file.size > 500 * 1024) {
        alert("Image must be under 500KB");
        return;
      }

      // Check dimensions (max 500x500px)
      const img = new Image();
      img.onload = function() {
        if (img.width > 500 || img.height > 500) {
          alert("Image dimensions must be max 500x500px");
        } else {
          setFormData(prev => ({ ...prev, profilePic: file }));
        }
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const validateForm = () => {
    const errors: string[] = [];
    if (!formData.username) errors.push("UserName is required.");
    if (!formData.firstName) errors.push("First Name is required.");
    if (!formData.lastName) errors.push("Last Name is required.");
    if (!formData.mobile) errors.push("Mobile Number is required.");
    if (!formData.email) errors.push("Email address is required.");
    if (!formData.role) errors.push("Role selection is required.");
    if (!formData.password) errors.push("Password is required.");
    if (!formData.confirmPassword) errors.push("Confirm Password is required.");
    if (!formData.warehouse) errors.push("Warehouse selection is required.");
    if (formData.password !== formData.confirmPassword) errors.push("Passwords do not match.");
    
    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? {
        ...u,
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobile: formData.mobile,
        email: formData.email,
        role: formData.role,
        warehouse: formData.warehouse
      } : u));
    } else {
      const newUser: User = {
        id: String(Date.now()),
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobile: formData.mobile,
        email: formData.email,
        role: formData.role,
        warehouse: formData.warehouse
      };
      setUsers([newUser, ...users]);
    }

    setShowAddModal(false);
    resetForm();
  };

  const handleEdit = (user: User) => {
    if (!isSuperAdmin) {
      alert("Only Super Admin can edit users.");
      return;
    }
    setEditingUser(user);
    setFormData({
      ...initialFormState,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      mobile: user.mobile,
      email: user.email,
      role: user.role,
      warehouse: user.warehouse,
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (!isSuperAdmin) {
      alert("Only Super Admin can delete users.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingUser(null);
    setFormErrors([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">User List</h2>
          <p className="text-slate-500 text-sm">View and manage all system accounts.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowAddModal(true); }}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={18} />
          <span>Create New User</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, username or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto text-slate-400 text-xs font-semibold uppercase tracking-wider">
          <span className="hidden sm:inline">Max 10 per page</span>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Warehouse</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 text-xs">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <p className="text-sm font-semibold text-slate-800">{user.firstName} {user.lastName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {user.username}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-full border border-blue-100">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {user.warehouse}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {isSuperAdmin && (
                        <>
                          <button 
                            onClick={() => handleEdit(user)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(user.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                      {!isSuperAdmin && (
                        <span className="text-[10px] text-slate-400 font-bold uppercase">View Only</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing <span className="font-bold text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-slate-700">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of <span className="font-bold text-slate-700">{filteredUsers.length}</span> entries
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 text-sm font-bold rounded-lg transition-all ${
                  currentPage === i + 1 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                    : 'text-slate-500 hover:bg-white border border-transparent hover:border-slate-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-blue-600 text-white flex-shrink-0">
              <h3 className="font-bold text-lg">{editingUser ? 'Edit User' : 'Create New User'}</h3>
              <button onClick={() => setShowAddModal(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              {formErrors.length > 0 && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase mb-2">
                    <AlertCircle size={14} />
                    <span>Mandatory fields required</span>
                  </div>
                  {formErrors.map((err, idx) => (
                    <p key={idx} className="text-xs text-red-500">• {err}</p>
                  ))}
                </div>
              )}

              <form onSubmit={handleSaveUser}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">UserName *</label>
                    <input
                      type="text"
                      name="username"
                      required
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                      placeholder="Username (Used to login)"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                      placeholder="First Name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                      placeholder="Last Name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mobile Number *</label>
                    <input
                      type="text"
                      name="mobile"
                      required
                      value={formData.mobile}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                      placeholder="Mobile Number"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Role *</label>
                    <select
                      name="role"
                      required
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                    >
                      <option value="">Select Role</option>
                      {availableRoles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password *</label>
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Confirm Password *</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Warehouse *</label>
                    <select
                      name="warehouse"
                      required
                      value={formData.warehouse}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                    >
                      <option value="">Select Warehouse</option>
                      <option value="All">All</option>
                      {MOCK_WAREHOUSES.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Profile Picture</label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 cursor-pointer">
                        <div className="w-full px-4 py-2 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-slate-500">
                          <Upload size={18} />
                          <span className="text-sm">Click to upload</span>
                          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </div>
                      </label>
                      {formData.profilePic && (
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                          <Check size={20} />
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Max 500*500px, under 500kb. (Optional)</p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 flex-shrink-0">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5"
                  >
                    Save Details
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
