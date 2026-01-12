
import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, MoreVertical, Eye, Edit2, 
  Trash2, FileText, Download, ChevronLeft, ChevronRight,
  ArrowUpRight, Clock, CheckCircle2, AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface SaleRecord {
  id: string;
  invoiceNo: string;
  date: string;
  customerName: string;
  warehouse: string;
  total: number;
  paid: number;
  status: 'Paid' | 'Unpaid' | 'Partial';
  createdBy: string;
}

const MOCK_SALES: SaleRecord[] = [
  { id: '1', invoiceNo: 'INV-10293', date: '2024-05-20', customerName: 'Alice Smith', warehouse: 'Main Warehouse', total: 1250.50, paid: 1250.50, status: 'Paid', createdBy: 'BenzWebTech' },
  { id: '2', invoiceNo: 'INV-10294', date: '2024-05-21', customerName: 'Bob Johnson', warehouse: 'Medical Section A', total: 450.00, paid: 200.00, status: 'Partial', createdBy: 'jdoe' },
  { id: '3', invoiceNo: 'INV-10295', date: '2024-05-21', customerName: 'Walk-in Customer', warehouse: 'Main Warehouse', total: 85.00, paid: 85.00, status: 'Paid', createdBy: 'BenzWebTech' },
  { id: '4', invoiceNo: 'INV-10296', date: '2024-05-22', customerName: 'Charlie Brown', warehouse: 'Pharma Store 1', total: 3200.00, paid: 0.00, status: 'Unpaid', createdBy: 'jdoe' },
  { id: '5', invoiceNo: 'INV-10297', date: '2024-05-22', customerName: 'Alice Smith', warehouse: 'Main Warehouse', total: 150.00, paid: 150.00, status: 'Paid', createdBy: 'BenzWebTech' },
];

const SalesList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredSales = useMemo(() => {
    return MOCK_SALES.filter(sale => 
      sale.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const paginatedSales = filteredSales.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusStyle = (status: SaleRecord['status']) => {
    switch (status) {
      case 'Paid': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Partial': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'Unpaid': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Sales List</h2>
          <p className="text-slate-500 text-sm">Review and manage your commercial sales invoices.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
            <Download size={18} /> Export
          </button>
          <Link 
            to="/sales/add"
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
          >
            <FileText size={18} /> Add New Sale
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search invoice number or customer name..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all">
          <Filter size={18} /> Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Invoice</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Warehouse</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-blue-600">#{sale.invoiceNo}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">By {sale.createdBy}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    {new Date(sale.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-800">{sale.customerName}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {sale.warehouse}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-800">${sale.total.toFixed(2)}</p>
                    <p className="text-[10px] text-emerald-500 font-bold tracking-tight">Paid: ${sale.paid.toFixed(2)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-full border ${getStatusStyle(sale.status)}`}>
                      {sale.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="View Details">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Edit Invoice">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedSales.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-3">
                      <FileText size={48} className="text-slate-100" />
                      <p>No sales records found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing <span className="font-bold text-slate-700">1</span> to <span className="font-bold text-slate-700">{paginatedSales.length}</span> of <span className="font-bold text-slate-700">{filteredSales.length}</span> entries
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 text-xs font-bold rounded-lg transition-all ${
                    currentPage === i + 1 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-500 hover:bg-white border border-transparent'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
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

      {/* Stats Summary Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fully Paid</p>
            <h4 className="text-xl font-black text-slate-800">$1,485.50</h4>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Partial Dues</p>
            <h4 className="text-xl font-black text-slate-800">$250.00</h4>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Unpaid</p>
            <h4 className="text-xl font-black text-slate-800">$3,200.00</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesList;
