export type Role = 'customer' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  age?: number;
  phoneNumber?: string;
  address?: string;
  country?: string;
}

export interface PortfolioComponent {
  type: 'Equities' | 'Fixed Income' | 'Mutual Funds' | 'Cash' | 'Alternative';
  name: string;
  value: number;
  description: string;
}

export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  components: PortfolioComponent[];
  totalValue: number;
  createdAt: string;
}

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  trend: 'up' | 'down';
}

export interface Prediction {
  symbol: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  recommendation: 'BUY' | 'HOLD' | 'SELL';
}

export interface LearningTopic {
  id: string;
  title: string;
  description: string;
  progress: number;
}
