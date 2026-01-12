
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  Contact, 
  TrendingUp, 
  Ticket, 
  FileText, 
  Package, 
  CreditCard, 
  Box, 
  BarChart2, 
  DollarSign, 
  MapPin, 
  MessageSquare, 
  FileSearch, 
  Warehouse as WarehouseIcon, 
  Settings 
} from 'lucide-react';

export const STORE_CONFIG = {
  name: 'Benz Medical & General Store',
  state: 'Maharashtra', // Default state for GST logic
};

export const SIDEBAR_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
  { 
    id: 'users', 
    label: 'Users', 
    icon: <Users size={20} />, 
    subItems: [
      { id: 'user-list', label: 'User List', path: '/users/list' },
      { id: 'user-roles', label: 'Role List', path: '/users/roles' }
    ] 
  },
  { 
    id: 'sales', 
    label: 'Sales', 
    icon: <ShoppingCart size={20} />, 
    subItems: [
      { id: 'pos-sale', label: 'POS Sale', path: '/sales/pos' },
      { id: 'add-sale', label: 'Add Sale', path: '/sales/add' },
      { id: 'sales-list', label: 'Sales List', path: '/sales/list' },
      { id: 'sales-payment', label: 'Sales Payment', path: '/sales/payment' },
      { id: 'sales-returns', label: 'Sales Returns List', path: '/sales/returns' }
    ]
  },
  { id: 'contacts', label: 'Contacts', icon: <Contact size={20} />, path: '/contacts' },
  { id: 'advance', label: 'Advance', icon: <TrendingUp size={20} />, path: '/advance' },
  { id: 'coupons', label: 'Coupons', icon: <Ticket size={20} />, path: '/coupons' },
  { id: 'quotation', label: 'Quotation', icon: <FileText size={20} />, path: '/quotation' },
  { id: 'purchase', label: 'Purchase', icon: <Package size={20} />, path: '/purchase' },
  { id: 'accounts', label: 'Accounts', icon: <CreditCard size={20} />, path: '/accounts' },
  { id: 'items', label: 'Items', icon: <Box size={20} />, path: '/items' },
  { id: 'stock', label: 'Stock', icon: <BarChart2 size={20} />, path: '/stock' },
  { id: 'expense', label: 'Expense', icon: <DollarSign size={20} />, path: '/expense' },
  { id: 'places', label: 'Places', icon: <MapPin size={20} />, path: '/places' },
  { id: 'messaging', label: 'Messaging', icon: <MessageSquare size={20} />, path: '/messaging' },
  { id: 'reports', label: 'Reports', icon: <FileSearch size={20} />, path: '/reports' },
  { id: 'warehouse', label: 'Warehouse', icon: <WarehouseIcon size={20} />, path: '/warehouse' },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} />, path: '/settings' },
];

export const MOCK_USERS = [
  { id: '1', username: 'BenzWebTech', firstName: 'Super', lastName: 'Admin', mobile: '1234567890', email: 'admin@benzerp.com', role: 'Super Admin', warehouse: 'All' },
  { id: '2', username: 'jdoe', firstName: 'John', lastName: 'Doe', mobile: '9876543210', email: 'john@benzerp.com', role: 'Manager', warehouse: 'Main Warehouse' },
];

export const MOCK_ROLES = [
  { id: '1', name: 'Super Admin', description: 'Full access to all system modules' },
  { id: '2', name: 'Manager', description: 'Access to sales and inventory management' },
  { id: '3', name: 'Salesman', description: 'Access to sales and quotation only' },
];

export const MOCK_WAREHOUSES = [
  { id: '1', name: 'Main Warehouse' },
  { id: '2', name: 'Medical Section A' },
  { id: '3', name: 'Pharma Store 1' },
];

export const MOCK_CUSTOMERS = [
  { id: '1', name: 'Walk-in Customer', mobile: '0000000000', previousDue: 0, state: 'Maharashtra' },
  { id: '2', name: 'Alice Smith', mobile: '9876543210', previousDue: 150.00, state: 'Maharashtra' },
  { id: '3', name: 'Bob Johnson', mobile: '9988776655', previousDue: 0, state: 'Karnataka' },
];

export const MOCK_POS_ITEMS = [
  { id: 'p1', name: 'Amoxicillin 500mg', code: 'AMX-001', batch: 'B2201', brand: 'PharmaCorp', category: 'Antibiotics', price: 12.50, stock: 150, gst: 12 },
  { id: 'p2', name: 'Paracetamol 650mg', code: 'PCM-650', batch: 'P650-A', brand: 'HealthLine', category: 'Pain Relief', price: 2.00, stock: 8, gst: 5 },
  { id: 'p3', name: 'Digital BP Monitor', code: 'BPM-D', batch: 'ELEC-99', brand: 'Omron', category: 'Equipment', price: 85.00, stock: 5, gst: 18 },
  { id: 'p4', name: 'Vitamin C Syrup', code: 'VIT-C-S', batch: 'VC-002', brand: 'NutriBio', category: 'Vitamins', price: 15.00, stock: 45, gst: 12 },
  { id: 'p5', name: 'Surgical Masks (50pk)', code: 'MSK-50', batch: 'HYG-01', brand: 'SafeGuard', category: 'Protection', price: 9.99, stock: 2, gst: 5 },
];

export const MOCK_COUPONS = [
  { code: 'BENZ10', type: 'percentage', value: 10 },
  { code: 'FLAT50', type: 'fixed', value: 50 },
  { code: 'SAVE20', type: 'percentage', value: 20 },
];
