
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, UserPlus, ShoppingCart, Trash2, Plus, Minus, 
  Pause, CreditCard, Banknote, Save, X, AlertTriangle, 
  MessageSquare, ChevronDown, Check, Info
} from 'lucide-react';
import { MOCK_WAREHOUSES, MOCK_CUSTOMERS, MOCK_POS_ITEMS } from '../constants';

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  stock: number;
  code: string;
}

const POSSale: React.FC = () => {
  // Main POS State
  const [selectedWarehouse, setSelectedWarehouse] = useState(MOCK_WAREHOUSES[0].name);
  const [selectedCustomer, setSelectedCustomer] = useState(MOCK_CUSTOMERS[0]);
  const [invoiceNumber, setInvoiceNumber] = useState('INV-10001');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [itemSearch, setItemSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerResults, setShowCustomerResults] = useState(false);
  const [sendWhatsApp, setSendWhatsApp] = useState(false);
  
  // Modals
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [heldTransactions, setHeldTransactions] = useState<any[]>([]);
  
  // Payment split state
  const [paymentSplits, setPaymentSplits] = useState({
    cash: 0,
    upi: 0,
    card: 0
  });

  // Calculate Totals
  const subTotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.qty), 0), [cart]);
  const totalDue = subTotal + selectedCustomer.previousDue;

  // Search Logic
  const filteredItems = useMemo(() => {
    if (!itemSearch.trim()) return [];
    const s = itemSearch.toLowerCase();
    return MOCK_POS_ITEMS.filter(i => 
      i.name.toLowerCase().includes(s) || 
      i.code.toLowerCase().includes(s) || 
      i.batch.toLowerCase().includes(s) ||
      i.brand.toLowerCase().includes(s) ||
      i.category.toLowerCase().includes(s)
    );
  }, [itemSearch]);

  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return [];
    const s = customerSearch.toLowerCase();
    return MOCK_CUSTOMERS.filter(c => 
      c.name.toLowerCase().includes(s) || 
      c.mobile.includes(s)
    );
  }, [customerSearch]);

  // Handlers
  const addToCart = (item: any) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      if (existing.qty + 1 > item.stock) {
        alert("Error: Not sufficient items in stock.");
        return;
      }
      updateQty(item.id, existing.qty + 1);
    } else {
      if (item.stock < 1) {
        alert("Error: Not sufficient items in stock.");
        return;
      }
      setCart([...cart, { id: item.id, name: item.name, price: item.price, qty: 1, stock: item.stock, code: item.code }]);
    }
    setItemSearch('');
  };

  const updateQty = (id: string, newQty: number) => {
    if (newQty < 1) return;
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        if (newQty > item.stock) {
          alert(`Error: Only ${item.stock} items in stock.`);
          return item;
        }
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleHold = () => {
    if (cart.length === 0) return;
    setHeldTransactions([...heldTransactions, { 
      id: Date.now(), 
      customer: selectedCustomer, 
      cart, 
      subTotal, 
      date: new Date().toLocaleTimeString() 
    }]);
    setCart([]);
    alert("Transaction held successfully.");
  };

  const handleCashPayment = () => {
    if (cart.length === 0) return;
    alert(`Payment successful! Total: $${subTotal.toFixed(2)}`);
    setCart([]);
    // Increment invoice number in a real app logic
  };

  const handlePayAll = () => {
    if (cart.length === 0 && selectedCustomer.previousDue === 0) return;
    alert(`Pay All successful! Current + Dues: $${totalDue.toFixed(2)}`);
    setCart([]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6 animate-in fade-in duration-500">
      {/* Top Controls: Warehouse & Invoice */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Warehouse</label>
            <select 
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="block w-48 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
            >
              {MOCK_WAREHOUSES.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
            </select>
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Invoice No.</label>
            <div className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 font-bold text-sm">
              {invoiceNumber}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
           {heldTransactions.length > 0 && (
             <button className="flex items-center gap-2 text-orange-600 bg-orange-50 px-4 py-2 rounded-xl text-sm font-bold border border-orange-100 hover:bg-orange-100 transition-all">
               <Pause size={16} />
               <span>{heldTransactions.length} Held Items</span>
             </button>
           )}
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Left Side: Cart & Item Search */}
        <div className="flex-[2] flex flex-col gap-4 min-w-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col min-h-0">
            {/* Item Search Bar */}
            <div className="p-4 border-b border-slate-100 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search item by code, name, batch, category, brand..."
                  value={itemSearch}
                  onChange={(e) => setItemSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Search Results Dropdown */}
              {itemSearch.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 z-30 max-h-64 overflow-y-auto">
                  {filteredItems.length > 0 ? (
                    filteredItems.map(item => (
                      <button 
                        key={item.id}
                        onClick={() => addToCart(item)}
                        className="w-full flex items-center justify-between p-4 hover:bg-blue-50 border-b border-slate-50 last:border-0 transition-colors text-left"
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-800">{item.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">
                            Code: {item.code} | Batch: {item.batch} | Brand: {item.brand}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-blue-600">${item.price.toFixed(2)}</p>
                          <p className={`text-[10px] font-bold ${item.stock < 10 ? 'text-orange-500' : 'text-slate-400'}`}>
                            Stock: {item.stock}
                          </p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-400 italic">No items found matching "{itemSearch}"</div>
                  )}
                </div>
              )}
            </div>

            {/* Cart Table */}
            <div className="flex-1 overflow-y-auto p-4">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="border-b border-slate-100">
                    <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Item Details</th>
                    <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-32">Price</th>
                    <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-32 text-center">Qty</th>
                    <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-32 text-right">Subtotal</th>
                    <th className="pb-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {cart.map(item => (
                    <tr key={item.id} className="group">
                      <td className="py-4">
                        <p className="text-sm font-bold text-slate-800">{item.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">{item.code}</span>
                          {item.stock < 10 && (
                            <span className="flex items-center gap-1 text-[9px] font-black text-orange-500 uppercase bg-orange-50 px-1.5 rounded">
                              <AlertTriangle size={10} /> Low Stock ({item.stock})
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 font-bold text-slate-700 text-sm">${item.price.toFixed(2)}</td>
                      <td className="py-4">
                        <div className="flex items-center justify-center gap-3">
                          <button 
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-400 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-bold text-sm w-4 text-center">{item.qty}</span>
                          <button 
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-400 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 text-right font-bold text-blue-600 text-sm">${(item.price * item.qty).toFixed(2)}</td>
                      <td className="py-4 text-right">
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {cart.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-20 text-center text-slate-400">
                        <div className="flex flex-col items-center gap-3">
                          <ShoppingCart size={48} className="text-slate-100" />
                          <p>Your cart is empty. Start adding items!</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Billing Summary */}
        <div className="flex-1 flex flex-col gap-4 min-w-[320px]">
          {/* Customer Selection */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                Customer Details
              </h3>
              <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Add New Customer">
                <UserPlus size={18} />
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text"
                placeholder="Search or add customer..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all"
                value={customerSearch}
                onChange={(e) => {
                  setCustomerSearch(e.target.value);
                  setShowCustomerResults(true);
                }}
                onBlur={() => setTimeout(() => setShowCustomerResults(false), 200)}
              />
              
              {showCustomerResults && customerSearch.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 z-30 max-h-48 overflow-y-auto">
                  {filteredCustomers.map(c => (
                    <button 
                      key={c.id}
                      onClick={() => {
                        setSelectedCustomer(c);
                        setCustomerSearch(c.name);
                        setShowCustomerResults(false);
                      }}
                      className="w-full p-3 text-left hover:bg-slate-50 border-b border-slate-50 last:border-0"
                    >
                      <p className="text-sm font-bold text-slate-800">{c.name}</p>
                      <p className="text-xs text-slate-400">{c.mobile}</p>
                    </button>
                  ))}
                  {filteredCustomers.length === 0 && (
                    <div className="p-4 text-center text-xs text-slate-400 italic">Customer not found. <span className="text-blue-600 font-bold cursor-pointer underline">Create New?</span></div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-tighter">Selected Customer</p>
                <p className="text-sm font-black text-slate-800">{selectedCustomer.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Previous Due</p>
                <p className={`text-sm font-black ${selectedCustomer.previousDue > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                  ${selectedCustomer.previousDue.toFixed(2)}
                </p>
              </div>
            </div>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors group">
              <input 
                type="checkbox" 
                checked={sendWhatsApp}
                onChange={(e) => setSendWhatsApp(e.target.checked)}
                className="w-5 h-5 rounded-lg text-blue-600 border-slate-300 focus:ring-blue-500"
              />
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-emerald-500" />
                <span className="text-sm font-semibold text-slate-700">Send WhatsApp Invoice</span>
              </div>
            </label>
          </div>

          {/* Pricing Calculations */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-auto">
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-slate-500 text-sm">
                <span>Items Subtotal</span>
                <span className="font-bold">${subTotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 text-sm">
                <span>Tax (0%)</span>
                <span className="font-bold">$0.00</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 text-sm">
                <span>Discount</span>
                <span className="font-bold text-emerald-500">-$0.00</span>
              </div>
              <div className="pt-3 border-t border-dashed border-slate-200 flex items-center justify-between">
                <span className="text-slate-800 font-black">Grand Total</span>
                <span className="text-2xl font-black text-blue-600">${subTotal.toFixed(2)}</span>
              </div>
              {selectedCustomer.previousDue > 0 && (
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest pt-1">
                  <span className="text-slate-400">Incl. Prev Dues</span>
                  <span className="text-red-400">${totalDue.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleHold}
                className="flex items-center justify-center gap-2 py-3 border-2 border-orange-100 text-orange-600 rounded-2xl font-bold text-sm hover:bg-orange-50 transition-all"
              >
                <Pause size={18} /> Hold
              </button>
              <button 
                onClick={() => setShowPaymentModal(true)}
                className="flex items-center justify-center gap-2 py-3 border-2 border-blue-100 text-blue-600 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-all"
              >
                <CreditCard size={18} /> Multi-Pay
              </button>
              <button 
                onClick={handleCashPayment}
                className="flex items-center justify-center gap-2 py-3 bg-slate-800 text-white rounded-2xl font-bold text-sm hover:bg-slate-900 transition-all shadow-lg shadow-slate-200"
              >
                <Banknote size={18} /> Cash Pay
              </button>
              <button 
                onClick={handlePayAll}
                className="flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                <Check size={18} /> Pay All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Split Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-blue-600 text-white">
              <div>
                <h3 className="font-black text-xl">Split Payment</h3>
                <p className="text-blue-100 text-xs">Distribute total across payment methods</p>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="hover:bg-white/20 p-2 rounded-xl transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center justify-between">
                <span className="font-bold text-slate-500">Amount to Pay</span>
                <span className="text-3xl font-black text-slate-800">${subTotal.toFixed(2)}</span>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Cash Amount</label>
                  <div className="relative">
                    <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="number" 
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-lg focus:ring-2 focus:ring-blue-500/20 outline-none" 
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">UPI / QR Payment</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="number" 
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-lg focus:ring-2 focus:ring-blue-500/20 outline-none" 
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Card Payment</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="number" 
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-lg focus:ring-2 focus:ring-blue-500/20 outline-none" 
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    alert("Multiple payment confirmed.");
                    setShowPaymentModal(false);
                    setCart([]);
                  }}
                  className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all"
                >
                  Finalize Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POSSale;
