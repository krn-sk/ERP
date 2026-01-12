
import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { 
  ArrowUpRight, ArrowDownRight, Users, 
  ShoppingBag, Receipt, Package, AlertTriangle, TrendingUp
} from 'lucide-react';
import { TimePeriod } from '../types';

const Dashboard: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(TimePeriod.ALL_TIME);

  const stats = [
    { label: 'Purchase Due', value: '$12,450', color: 'text-red-600', bg: 'bg-red-50', icon: <ArrowDownRight size={20} /> },
    { label: 'Sales Due', value: '$8,210', color: 'text-blue-600', bg: 'bg-blue-50', icon: <ArrowUpRight size={20} /> },
    { label: 'Total Sales', value: '$142,880', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: <TrendingUp size={20} /> },
    { label: 'Total Expense', value: '$45,200', color: 'text-orange-600', bg: 'bg-orange-50', icon: <Receipt size={20} /> },
    { label: 'Customers', value: '1,284', color: 'text-blue-700', bg: 'bg-blue-100/50', icon: <Users size={20} /> },
    { label: 'Suppliers', value: '86', color: 'text-indigo-600', bg: 'bg-indigo-50', icon: <Package size={20} /> },
    { label: 'Purchases', value: '452', color: 'text-violet-600', bg: 'bg-violet-50', icon: <ShoppingBag size={20} /> },
    { label: 'Invoices', value: '2,891', color: 'text-sky-600', bg: 'bg-sky-50', icon: <FileTextIcon size={20} /> },
  ];

  const chartData = [
    { name: 'Jan', purchase: 4000, sales: 2400, expense: 2400 },
    { name: 'Feb', purchase: 3000, sales: 1398, expense: 2210 },
    { name: 'Mar', purchase: 2000, sales: 9800, expense: 2290 },
    { name: 'Apr', purchase: 2780, sales: 3908, expense: 2000 },
    { name: 'May', purchase: 1890, sales: 4800, expense: 2181 },
    { name: 'Jun', purchase: 2390, sales: 3800, expense: 2500 },
    { name: 'Jul', purchase: 3490, sales: 4300, expense: 2100 },
  ];

  const criticalStocks = [
    { id: '1', name: 'Amoxicillin 500mg', sku: 'MED-AMX-500', stock: 8, unit: 'Boxes' },
    { id: '2', name: 'Paracetamol Syrup', sku: 'MED-PCM-SYR', stock: 4, unit: 'Bottles' },
    { id: '3', name: 'Vitamin C 1000mg', sku: 'VIT-C-1000', stock: 2, unit: 'Packs' },
    { id: '4', name: 'Surgical Gloves (M)', sku: 'SUR-GLV-M', stock: 9, unit: 'Boxes' },
  ];

  const recentItems = [
    { id: '101', name: 'Digital Thermometer', category: 'Equipment', price: '$15.99', date: '2 hours ago' },
    { id: '102', name: 'N95 Respirators', category: 'Protection', price: '$45.00', date: '5 hours ago' },
    { id: '103', name: 'Insulin Pen', category: 'Pharmacy', price: '$120.00', date: 'Yesterday' },
  ];

  const trendingItems = [
    { name: 'Face Masks 3-Ply', sales: 420, trend: '+12%' },
    { name: 'Antiseptic Solution', sales: 380, trend: '+8%' },
    { name: 'Digital BP Monitor', sales: 250, trend: '+15%' },
    { name: 'Omega-3 Supplements', sales: 210, trend: '+5%' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Business Overview</h2>
          <p className="text-slate-500 text-sm">Welcome back to your administration panel.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
          {Object.values(TimePeriod).map((p) => (
            <button
              key={p}
              onClick={() => setTimePeriod(p)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                timePeriod === p 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
              <h3 className={`text-2xl font-bold ${stat.color}`}>{stat.value}</h3>
            </div>
            <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-800">Financial Performance</h3>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Sales</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-violet-500"></span> Purchase</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-500"></span> Expense</div>
          </div>
        </div>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip 
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
              />
              <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              <Area type="monotone" dataKey="purchase" stroke="#8b5cf6" strokeWidth={3} fill="transparent" />
              <Area type="monotone" dataKey="expense" stroke="#f97316" strokeWidth={3} fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Items */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4">Recently Added Items</h3>
          <div className="space-y-4">
            {recentItems.map(item => (
              <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                  <Package size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                  <p className="text-xs text-slate-400">{item.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-600">{item.price}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            View All Inventory
          </button>
        </div>

        {/* Critical Stock */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">Critical Stock Alerts</h3>
            <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Action Required</span>
          </div>
          <div className="space-y-3">
            {criticalStocks.map(stock => (
              <div key={stock.id} className="p-3 bg-red-50/50 rounded-xl border border-red-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-red-500">
                    <AlertTriangle size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{stock.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium">SKU: {stock.sku}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-red-600">{stock.stock}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{stock.unit}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            Refill Stock Now
          </button>
        </div>

        {/* Top Trending */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4">Trending Items</h3>
          <div className="space-y-4">
            {trendingItems.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-100">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{width: `${100 - (i * 15)}%`}}></div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-700">{item.sales} sold</p>
                  <p className="text-[10px] text-emerald-500 font-bold">{item.trend}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal utility to handle missing imports if any
const FileTextIcon = ({size}: {size: number}) => <Receipt size={size} />;

export default Dashboard;
