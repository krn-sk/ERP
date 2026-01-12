
export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  role: string;
  warehouse: string;
  profilePic?: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions?: Record<string, string[]>;
}

export interface Warehouse {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  stock: number;
  price: number;
  category: string;
  trendScore: number;
  addedDate: string;
}

export enum TimePeriod {
  TODAY = 'Today',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
  YEARLY = 'Yearly',
  ALL_TIME = 'All Time'
}
