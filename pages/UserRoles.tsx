
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Shield, Plus, Search, Filter, Edit2, Trash2, X, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle
} from 'lucide-react';
import { MOCK_ROLES } from '../constants';
import { Role } from '../types';

interface ModulePermission {
  name: string;
  options: string[];
}

const MODULES: ModulePermission[] = [
  { name: 'Users', options: ['View', 'Add', 'Edit', 'Delete'] },
  { name: 'Roles', options: ['View', 'Add', 'Edit', 'Delete'] },
  { name: 'Tax', options: ['View', 'Add', 'Edit', 'Delete'] },
  { name: 'Units', options: ['View', 'Add', 'Edit', 'Delete'] },
  { name: 'Payment Types', options: ['View', 'Add', 'Edit', 'Delete'] },
  { name: 'Warehouse', options: ['View', 'Add', 'Edit', 'Delete'] },
  { name: 'Store (Own Store)', options: ['Edit Only'] },
  { name: 'Dashboard', options: ['View Dashboard Data', 'Information Box 1', 'Information Box 2', 'Purchase And Sales Chart', 'Recently Added Items List', 'Stock Alert List', 'Trending Items Chart', 'Recent Sales Invoice List'] },
  { name: 'Accounts', options: ['Add', 'Edit', 'Delete', 'View', 'Add Money Deposit', 'Edit Money Deposit', 'Delete Money Deposit', 'View Money Deposit', 'Add Money Transfer', 'Edit Money Transfer', 'Delete Money Transfer', 'View Money Transfer', 'Cash Transactions'] },
  { name: 'Expense', options: ['Add', 'Edit', 'Delete', 'View', 'Add Money Deposit', 'Edit Money Deposit', 'Delete Money Deposit', 'View Money Deposit', 'Add Money Transfer', 'Edit Money Transfer', 'Delete Money Transfer', 'View Money Transfer', 'Cash Transactions'] },
  { name: 'Items', options: ['Add', 'Edit', 'Delete', 'View', 'Category Add', 'Category Edit', 'Category Delete', 'Category View', 'Print Labels', 'Import Items', 'Import Services'] },
  { name: 'Services', options: ['Add', 'Edit', 'Delete', 'View'] },
  { name: 'Stock Transfer', options: ['Add', 'Edit', 'Delete', 'View'] },
  { name: 'Stock Adjustment', options: ['Add', 'Edit', 'Delete', 'View'] },
  { name: 'Brand', options: ['Add', 'Edit', 'Delete', 'View'] },
  { name: 'Varient', options: ['Add', 'Edit', 'Delete', 'View'] },
  { name: 'Suppliers', options: ['Add', 'Edit', 'Delete', 'View', 'Import Suppliers'] },
  { name: 'Customers', options: ['Add', 'Edit', 'Delete', 'View', 'Import Customers'] },
  { name: 'Customer Advance Payments', options: ['Add', 'Edit', 'Delete', 'View'] },
  { name: 'Purchase', options: ['Add', 'Edit', 'Delete', 'View', 'Purchase Payments View', 'Purchase Payments Add', 'Purchase Payments Delete', 'Show all users Purchase Invoices'] },
  { name: 'Purchase Return', options: ['Add', 'Edit', 'Delete', 'View', 'Purchase Return Payments View', 'Purchase Return Payments Add', 'Purchase Return Payments Delete', 'Show all users Purchase Return Invoices'] },
  { name: 'Sales(includes POS)', options: ['POS', 'Add', 'Edit', 'Delete', 'View', 'Sales Payments View', 'Sales Payments Add', 'Sales Payments Delete', 'Show all users Sales Invoices', 'Show Item Purchase Price'] },
  { name: 'Discount Coupon', options: ['Add', 'Edit', 'Delete', 'View'] },
  { name: 'Customer Coupon', options: ['Add', 'Edit', 'Delete', 'View'] },
  { name: 'Quotation', options: ['Add', 'Edit', 'Delete', 'View', 'Show all user quotations'] },
  { name: 'Sales Return', options: ['Add', 'Edit', 'Delete', 'View', 'Sales Return Payments View', 'Sales Return Payments Add', 'Sales Return Payments Delete', 'Show all users Sales Return Invoices'] },
  { name: 'SMS/Whatsapp', options: ['Message Settings', 'Send Message', 'Message Template Edit', 'Message Template View', 'Message API View', 'Message API Edit'] },
  { name: 'Reports', options: ['Customer Orders Report', 'Sales Tax Report', 'Purchase Tax Report', 'Supplier Items Report', 'Sales Report', 'Sales Return Report', 'Seller Points Report', 'Purchase Report', 'Purchase Return Report', 'Expense Report', 'Profit Report', 'Stock Report', 'Sales Item Report', 'Return Items Report', 'Purchase Payments Report', 'Sales Payments Report', 'Sales Return Payments', 'GSTR-1 Report', 'GSTR-2 Report', 'Sales GST Report', 'Purchase GST Report', 'Stock Transfer Report', 'Sales Summary Report'] },
];

const UserRoles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>(() => {
    const saved = localStorage.getItem('benz_roles');
    return saved ? JSON.parse(saved) : MOCK_ROLES;
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // Sync with localStorage whenever roles change
  useEffect(() => {
    localStorage.setItem('benz_roles', JSON.stringify(roles));
  }, [roles]);

  // Auth Simulation
  const currentUser = "BenzWebTech";
  const isSuperAdmin = currentUser === "BenzWebTech";

  // Form State
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState<Record<string, string[]>>({});

  const filteredRoles = useMemo(() => {
    return roles.filter(role => 
      role.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [roles, searchTerm]);

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const paginatedRoles = filteredRoles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const togglePermission = (moduleName: string, option: string) => {
    setPermissions(prev => {
      const modulePerms = prev[moduleName] || [];
      if (modulePerms.includes(option)) {
        return { ...prev, [moduleName]: modulePerms.filter(o => o !== option) };
      } else {
        return { ...prev, [moduleName]: [...modulePerms, option] };
      }
    });
  };

  const toggleAllInModule = (moduleName: string, options: string[]) => {
    setPermissions(prev => {
      const modulePerms = prev[moduleName] || [];
      if (modulePerms.length === options.length) {
        return { ...prev, [moduleName]: [] };
      } else {
        return { ...prev, [moduleName]: [...options] };
      }
    });
  };

  const resetForm = () => {
    setRoleName('');
    setDescription('');
    setPermissions({});
    setEditingRole(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName) return alert("Role name is mandatory");

    const newRoleData: Role = {
      id: editingRole ? editingRole.id : String(Date.now()),
      name: roleName,
      description,
      permissions: permissions // Critical fix: Actually save the permissions
    };

    if (editingRole) {
      setRoles(roles.map(r => r.id === editingRole.id ? newRoleData : r));
    } else {
      setRoles([...roles, newRoleData]);
    }
    setShowModal(false);
    resetForm();
  };

  const handleEdit = (role: Role) => {
    if (!isSuperAdmin) return alert("Only Super Admin can edit roles");
    setEditingRole(role);
    setRoleName(role.name);
    setDescription(role.description);
    setPermissions(role.permissions || {});
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (!isSuperAdmin) return alert("Only Super Admin can delete roles");
    if (window.confirm("Delete this role?")) {
      setRoles(roles.filter(r => r.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Role List</h2>
          <p className="text-slate-500 text-sm">Create and manage access control for system modules.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5"
        >
          <Plus size={18} />
          <span>Create New Role</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search roles by name..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          Max 10 per page
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedRoles.map(role => (
              <tr key={role.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <Shield size={16} />
                    </div>
                    <span className="font-semibold text-slate-800 text-sm">{role.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 italic max-w-xs truncate">
                  {role.description || 'No description provided'}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {isSuperAdmin && (
                      <>
                        <button onClick={() => handleEdit(role)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(role.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {paginatedRoles.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-slate-400">No roles found.</td>
              </tr>
            )}
          </tbody>
        </table>
        
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">Page {currentPage} of {totalPages || 1}</p>
          <div className="flex items-center gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(c => c - 1)} className="p-2 border border-slate-200 rounded-lg disabled:opacity-50"><ChevronLeft size={16} /></button>
            <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(c => c + 1)} className="p-2 border border-slate-200 rounded-lg disabled:opacity-50"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-blue-600 text-white">
              <h3 className="font-bold text-lg">{editingRole ? 'Edit Role' : 'Create New Role'}</h3>
              <button onClick={() => setShowModal(false)} className="hover:bg-white/20 p-1.5 rounded-lg"><X size={20} /></button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Role Name *</label>
                    <input 
                      required
                      value={roleName}
                      onChange={e => setRoleName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm"
                      placeholder="e.g. Sales Manager"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
                    <input 
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm"
                      placeholder="Brief description of the role responsibilities"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-800">Module Permissions</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Select allowed operations for each module</p>
                  </div>
                  
                  <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100 bg-slate-50/50">
                    <div className="grid grid-cols-12 bg-slate-100 px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <div className="col-span-3">Module Name</div>
                      <div className="col-span-9">Permissions</div>
                    </div>
                    {MODULES.map((mod) => (
                      <div key={mod.name} className="grid grid-cols-12 px-4 py-4 items-center gap-4 bg-white group hover:bg-blue-50/20">
                        <div className="col-span-3">
                          <p className="text-sm font-semibold text-slate-700">{mod.name}</p>
                        </div>
                        <div className="col-span-9">
                          <div className="flex flex-wrap gap-x-6 gap-y-3">
                            <label className="flex items-center gap-2 cursor-pointer group/item">
                              <input 
                                type="checkbox"
                                checked={(permissions[mod.name] || []).length === mod.options.length && mod.options.length > 0}
                                onChange={() => toggleAllInModule(mod.name, mod.options)}
                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-xs font-bold text-blue-600 uppercase">Select All</span>
                            </label>
                            {mod.options.map(opt => (
                              <label key={opt} className="flex items-center gap-2 cursor-pointer group/item">
                                <input 
                                  type="checkbox"
                                  checked={(permissions[mod.name] || []).includes(opt)}
                                  onChange={() => togglePermission(mod.name, opt)}
                                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-xs text-slate-600 group-hover/item:text-slate-900 transition-colors">{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white">
                  <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                  <button type="submit" className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">Save Role Details</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRoles;
