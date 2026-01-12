
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, Trash2, Search, Calendar, UserPlus, 
  Ticket, MessageSquare, Save, X, AlertCircle, Info, Truck
} from 'lucide-react';
import { MOCK_WAREHOUSES, MOCK_CUSTOMERS, MOCK_POS_ITEMS, MOCK_COUPONS, STORE_CONFIG } from '../constants';

interface SaleItemLine {
  id: string;
  productId: string;
  name: string;
  qty: number;
  unitPrice: number;
  taxPercent: number;
  discountPercent: number;
  stock: number;
}

const AddSale: React.FC = () => {
  // Header State
  const [selectedWarehouse, setSelectedWarehouse] = useState(MOCK_WAREHOUSES[0].name);
  const [invoiceNumber] = useState(`INV-${Date.now().toString().slice(-6)}`);
  const [selectedCustomer, setSelectedCustomer] = useState(MOCK_CUSTOMERS[0]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerResults, setShowCustomerResults] = useState(false);
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [referenceNo, setReferenceNo] = useState('');

  // Items State
  const [lines, setLines] = useState<SaleItemLine[]>([
    { id: '1', productId: '', name: '', qty: 1, unitPrice: 0, taxPercent: 0, discountPercent: 0, stock: 0 }
  ]);
  const [itemSearchText, setItemSearchText] = useState<{ [key: string]: string }>({});
  const [itemSearchResults, setItemSearchResults] = useState<{ [key: string]: any[] }>({});

  // Summary State
  const [otherCharges, setOtherCharges] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [activeCoupon, setActiveCoupon] = useState<any>(null);
  const [notes, setNotes] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [paymentType, setPaymentType] = useState('Cash');
  const [sendWhatsApp, setSendWhatsApp] = useState(false);

  // GST Logic: Same State = CGST/SGST, Different = IGST
  const isInterState = selectedCustomer.state !== STORE_CONFIG.state;

  // Calculations
  const calculations = useMemo(() => {
    let subTotal = 0;
    let totalTax = 0;
    let totalDiscount = 0;

    const lineCalculations = lines.map(line => {
      const baseTotal = line.unitPrice * line.qty;
      const taxAmount = baseTotal * (line.taxPercent / 100);
      const totalBeforeLineDisc = baseTotal + taxAmount;
      const lineDiscAmount = totalBeforeLineDisc * (line.discountPercent / 100);
      const finalLineTotal = totalBeforeLineDisc - lineDiscAmount;

      subTotal += baseTotal;
      totalTax += taxAmount;
      totalDiscount += lineDiscAmount;

      return finalLineTotal;
    });

    let couponDiscountAmount = 0;
    const preCouponTotal = subTotal + totalTax - totalDiscount + otherCharges;
    
    if (activeCoupon) {
      if (activeCoupon.type === 'percentage') {
        couponDiscountAmount = preCouponTotal * (activeCoupon.value / 100);
      } else {
        couponDiscountAmount = activeCoupon.value;
      }
    }

    const grandTotal = preCouponTotal - couponDiscountAmount;
    const roundedTotal = Math.round(grandTotal);
    const roundOff = roundedTotal - grandTotal;

    return {
      subTotal,
      totalTax,
      totalDiscount,
      couponDiscountAmount,
      roundOff,
      grandTotal: roundedTotal
    };
  }, [lines, otherCharges, activeCoupon]);

  // Handlers
  const addLine = () => {
    setLines([...lines, { 
      id: Math.random().toString(36).substr(2, 9), 
      productId: '', name: '', qty: 1, unitPrice: 0, taxPercent: 0, discountPercent: 0, stock: 0 
    }]);
  };

  const removeLine = (id: string) => {
    if (lines.length === 1) return;
    setLines(lines.filter(l => l.id !== id));
  };

  const updateLine = (id: string, updates: Partial<SaleItemLine>) => {
    setLines(lines.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const handleItemSearch = (lineId: string, text: string) => {
    setItemSearchText(prev => ({ ...prev, [lineId]: text }));
    if (!text.trim()) {
      setItemSearchResults(prev => ({ ...prev, [lineId]: [] }));
      return;
    }
    const results = MOCK_POS_ITEMS.filter(i => 
      i.name.toLowerCase().includes(text.toLowerCase()) || 
      i.code.toLowerCase().includes(text.toLowerCase())
    );
    setItemSearchResults(prev => ({ ...prev, [lineId]: results }));
  };

  const selectItemForLine = (lineId: string, item: any) => {
    updateLine(lineId, {
      productId: item.id,
      name: item.name,
      unitPrice: item.price,
      taxPercent: item.gst,
      stock: item.stock
    });
    setItemSearchText(prev => ({ ...prev, [lineId]: item.name }));
    setItemSearchResults(prev => ({ ...prev, [lineId]: [] }));
  };

  const validateCoupon = () => {
    const found = MOCK_COUPONS.find(c => c.code.toUpperCase() === couponCode.toUpperCase());
    if (found) {
      setActiveCoupon(found);
    } else {
      alert("Invalid Coupon Code");
      setActiveCoupon(null);
    }
  };

  const handleSave = () => {
    // Validation
    const invalidStock = lines.find(l => l.qty > l.stock);
    if (invalidStock) {
      alert(`Insufficient stock for ${invalidStock.name}. Available: ${invalidStock.stock}`);
      return;
    }
    if (!selectedCustomer) return alert("Please select a customer");
    
    alert("Invoice saved successfully! Redirecting to Sales List...");
    // In a real app, logic to save to DB and navigate
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Add Sale</h2>
          <p className="text-slate-500 text-sm">Create a new commercial tax invoice.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="px-6 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all">Cancel</button>
           <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
             <Save size={18} /> Save Invoice
           </button>
        </div>
      </div>

      {/* Header Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Warehouse</label>
          <select 
            value={selectedWarehouse} 
            onChange={e => setSelectedWarehouse(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
          >
            {MOCK_WAREHOUSES.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Invoice Number</label>
          <div className="bg-blue-50 border border-blue-100 text-blue-700 px-4 py-2.5 rounded-xl font-bold text-sm">
            {invoiceNumber}
          </div>
        </div>

        <div className="space-y-1.5 relative">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
            Customer
            <button className="text-blue-600 hover:underline">Add New</button>
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search customer..."
              value={customerSearch}
              onChange={(e) => {
                setCustomerSearch(e.target.value);
                setShowCustomerResults(true);
              }}
              onFocus={() => setShowCustomerResults(true)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
          {showCustomerResults && customerSearch.trim() && (
            <div className="absolute top-full left-0 right-0 z-30 bg-white shadow-xl border border-slate-100 rounded-xl mt-1 max-h-48 overflow-y-auto">
              {MOCK_CUSTOMERS.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase())).map(c => (
                <button 
                  key={c.id}
                  onClick={() => {
                    setSelectedCustomer(c);
                    setCustomerSearch(c.name);
                    setShowCustomerResults(false);
                  }}
                  className="w-full p-3 text-left hover:bg-blue-50 text-sm border-b border-slate-50 last:border-0"
                >
                  <p className="font-bold text-slate-800">{c.name}</p>
                  <p className="text-xs text-slate-400">{c.mobile} | {c.state}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sales Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="date" 
              value={saleDate}
              onChange={e => setSaleDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Due Date</label>
          <input 
            type="date" 
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reference No.</label>
          <input 
            type="text" 
            placeholder="e.g. PO-9921"
            value={referenceNo}
            onChange={e => setReferenceNo(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
          />
        </div>

        <div className="col-span-1 md:col-span-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
          <Info size={20} className="text-emerald-600" />
          <div className="text-xs">
            <p className="font-bold text-emerald-800">GST Configuration Applied</p>
            <p className="text-emerald-600">
              Store State: <b>{STORE_CONFIG.state}</b> | Customer State: <b>{selectedCustomer.state}</b> 
              ({isInterState ? 'IGST 100%' : 'CGST 50% + SGST 50%'})
            </p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Item Name / Search</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-24">Qty</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-32">Unit Price</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-28">GST %</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-28">Disc %</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-32 text-right">Total</th>
              <th className="px-6 py-4 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {lines.map((line) => {
              const base = line.qty * line.unitPrice;
              const tax = base * (line.taxPercent / 100);
              const totalLine = (base + tax) * (1 - line.discountPercent / 100);

              return (
                <tr key={line.id} className="group">
                  <td className="px-6 py-4 relative">
                    <input 
                      type="text"
                      placeholder="Type item name or code..."
                      value={itemSearchText[line.id] || line.name}
                      onChange={(e) => handleItemSearch(line.id, e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"
                    />
                    {itemSearchResults[line.id] && itemSearchResults[line.id]!.length > 0 && (
                      <div className="absolute left-6 right-6 top-full z-20 bg-white shadow-2xl border border-slate-100 rounded-xl mt-1 overflow-hidden">
                        {itemSearchResults[line.id]!.map(item => (
                          <button 
                            key={item.id}
                            onClick={() => selectItemForLine(line.id, item)}
                            className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center justify-between border-b border-slate-50 last:border-0"
                          >
                            <div>
                              <p className="text-sm font-bold text-slate-800">{item.name}</p>
                              <p className="text-[10px] text-slate-400 uppercase font-bold">Stock: {item.stock} | Code: {item.code}</p>
                            </div>
                            <span className="text-sm font-bold text-blue-600">${item.price}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      type="number"
                      value={line.qty}
                      onChange={e => updateLine(line.id, { qty: Number(e.target.value) })}
                      className={`w-full bg-slate-50 border rounded-lg px-2 py-2 text-sm outline-none ${line.qty > line.stock ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-blue-500'}`}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      type="number"
                      value={line.unitPrice}
                      onChange={e => updateLine(line.id, { unitPrice: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-sm focus:border-blue-500 outline-none"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400">{line.taxPercent}%</span>
                      <span className="text-xs font-semibold text-slate-600">
                        {isInterState ? `IGST: $${(base * (line.taxPercent/100)).toFixed(2)}` : `C/S: $${(base * (line.taxPercent/200)).toFixed(2)} ea.`}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      type="number"
                      value={line.discountPercent}
                      onChange={e => updateLine(line.id, { discountPercent: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-sm focus:border-blue-500 outline-none"
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-sm font-bold text-slate-800">${totalLine.toFixed(2)}</p>
                    {line.discountPercent > 0 && <p className="text-[10px] text-emerald-500 font-bold">-{line.discountPercent}% Off Post-Tax</p>}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => removeLine(line.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <button onClick={addLine} className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:underline">
            <Plus size={16} /> Add More Line
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Additional Details */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <Ticket size={18} className="text-blue-600" /> Coupons & Charges
              </h4>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    placeholder="Enter coupon code..."
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                  />
                  {activeCoupon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-100 text-emerald-700 p-1 rounded">
                      <Check size={14} />
                    </div>
                  )}
                </div>
                <button onClick={validateCoupon} className="px-6 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-all text-sm">Apply</button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Other Charges</label>
                  <input 
                    type="number"
                    value={otherCharges}
                    onChange={e => setOtherCharges(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Truck size={12} /> Vehicle Number
                  </label>
                  <input 
                    type="text"
                    placeholder="MH-12-AB-1234"
                    value={vehicleNo}
                    onChange={e => setVehicleNo(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>
           </div>

           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Internal Notes</label>
             <textarea 
               rows={3} 
               placeholder="Add internal notes about this sale or delivery instructions..."
               value={notes}
               onChange={e => setNotes(e.target.value)}
               className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-blue-500"
             />
           </div>
        </div>

        {/* Summary Card */}
        <div className="bg-slate-800 text-white p-8 rounded-3xl shadow-xl shadow-slate-200 space-y-6">
           <h4 className="text-lg font-black uppercase tracking-widest border-b border-slate-700 pb-4">Invoice Summary</h4>
           
           <div className="space-y-4">
              <div className="flex justify-between text-slate-400 font-medium">
                <span>Items Subtotal (Pre-Tax)</span>
                <span className="text-white font-bold">${calculations.subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400 font-medium">
                <span>Total Calculated Tax (GST)</span>
                <span className="text-white font-bold">${calculations.totalTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400 font-medium">
                <span>Line Item Discounts</span>
                <span className="text-emerald-400 font-bold">-${calculations.totalDiscount.toFixed(2)}</span>
              </div>
              {otherCharges > 0 && (
                <div className="flex justify-between text-slate-400 font-medium">
                  <span>Other Charges</span>
                  <span className="text-white font-bold">+${otherCharges.toFixed(2)}</span>
                </div>
              )}
              {activeCoupon && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Coupon: {activeCoupon.code}</span>
                  <span className="font-bold">-${calculations.couponDiscountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500 text-xs italic">
                <span>Rounding Adjustment</span>
                <span>{calculations.roundOff > 0 ? '+' : ''}{calculations.roundOff.toFixed(2)}</span>
              </div>
           </div>

           <div className="pt-6 border-t border-slate-700 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Grand Total</p>
                <h3 className="text-4xl font-black text-blue-400">${calculations.grandTotal.toFixed(2)}</h3>
              </div>
              <div className="text-right">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Payment Method</label>
                <select 
                  value={paymentType}
                  onChange={e => setPaymentType(e.target.value)}
                  className="bg-slate-700 border-none rounded-lg px-3 py-1 text-sm font-bold text-white outline-none"
                >
                  <option>Cash</option>
                  <option>UPI / QR</option>
                  <option>Bank Transfer</option>
                  <option>Card</option>
                </select>
              </div>
           </div>

           <div className="pt-6 flex flex-col gap-4">
              <label className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-2xl cursor-pointer hover:bg-slate-700 transition-colors group">
                <input 
                  type="checkbox" 
                  checked={sendWhatsApp}
                  onChange={e => setSendWhatsApp(e.target.checked)}
                  className="w-5 h-5 rounded-lg bg-slate-800 border-slate-600 text-blue-500 focus:ring-blue-500"
                />
                <div className="flex items-center gap-2">
                  <MessageSquare size={18} className="text-emerald-400" />
                  <span className="text-sm font-bold group-hover:text-emerald-400 transition-colors">Send GST Invoice via WhatsApp</span>
                </div>
              </label>

              <button 
                onClick={handleSave}
                className="w-full py-5 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 transition-all transform hover:-translate-y-1 active:translate-y-0"
              >
                FINALISE & SAVE INVOICE
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

const Check = ({size}: {size: number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default AddSale;
