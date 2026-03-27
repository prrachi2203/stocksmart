import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Activity } from 'lucide-react';
import StockChart from './StockChart';
import { motion } from 'motion/react';
import { User, Stock, Prediction } from '../types';
import { db, collection, onSnapshot, query, where, handleFirestoreError, OperationType } from '../firebase';

interface DashboardProps {
  user: User;
}

export default function Dashboard({ user }: DashboardProps) {
  const [stocks, setStocks] = React.useState<Stock[]>([]);
  const [predictions, setPredictions] = React.useState<Prediction[]>([]);
  const [customerData, setCustomerData] = React.useState<any>(null);

  React.useEffect(() => {
    // Listen for trending stocks
    const stocksUnsubscribe = onSnapshot(collection(db, 'stocks'), (snapshot) => {
      const stocksList = snapshot.docs.map(doc => doc.data() as Stock);
      setStocks(stocksList);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'stocks'));

    // Listen for AI predictions
    const predictionsUnsubscribe = onSnapshot(collection(db, 'predictions'), (snapshot) => {
      const predList = snapshot.docs.map(doc => doc.data() as Prediction);
      setPredictions(predList);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'predictions'));

    // Listen for customer specific data
    if (user.role === 'customer') {
      const customerUnsubscribe = onSnapshot(query(collection(db, 'customers'), where('userId', '==', user.id)), (snapshot) => {
        if (!snapshot.empty) {
          setCustomerData(snapshot.docs[0].data());
        }
      }, (error) => handleFirestoreError(error, OperationType.GET, `customers/${user.id}`));
      return () => {
        stocksUnsubscribe();
        predictionsUnsubscribe();
        customerUnsubscribe();
      };
    }

    return () => {
      stocksUnsubscribe();
      predictionsUnsubscribe();
    };
  }, [user.id, user.role]);

  const stats = [
    { label: 'Total Balance', value: customerData ? `$${customerData.balanceAmount.toLocaleString()}` : '$0.00', change: '+2.4%', icon: DollarSign, color: 'text-accent-green' },
    { label: 'Portfolio Value', value: '$38,122.00', change: '+5.1%', icon: PieChart, color: 'text-accent-green' },
    { label: 'Today\'s Profit', value: '+$1,240.50', change: '+0.8%', icon: Activity, color: 'text-accent-green' },
    { label: 'Risk Level', value: customerData?.riskLevel || 'Moderate', change: 'Stable', icon: TrendingUp, color: 'text-slate-400' },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-200">Welcome back, {user.name.split(' ')[0]}</h1>
          <p className="text-slate-400 mt-1">Here's what's happening with your portfolio today.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400 uppercase tracking-wider font-semibold">Market Status</p>
          <div className="flex items-center gap-2 text-accent-green font-medium">
            <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
            Open
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className="glass p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all group"
          >
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-accent-green' : 'text-accent-red'}`}>
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-200 mt-1">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-8 rounded-3xl border border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-200">Market Performance</h2>
            <select className="bg-brand-surface text-slate-200 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-accent-green">
              {stocks.length > 0 ? stocks.map(s => (
                <option key={s.symbol}>{s.symbol} - {s.name}</option>
              )) : (
                <option>Loading stocks...</option>
              )}
            </select>
          </div>
          <StockChart symbol="AAPL" />
        </div>

        <div className="glass p-8 rounded-3xl border border-white/5">
          <h2 className="text-xl font-bold text-slate-200 mb-6">AI Predictions</h2>
          <div className="space-y-6">
            {predictions.length > 0 ? predictions.map((stock) => (
              <div key={stock.stockSymbol} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                <div>
                  <h4 className="font-bold text-slate-200">{stock.stockSymbol}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Current: ${stock.currentPrice}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${stock.recommendation === 'BUY' ? 'bg-accent-green/10 text-accent-green' : 'bg-accent-red/10 text-accent-red'}`}>
                    {stock.recommendation}
                  </span>
                  <p className="text-sm font-bold text-slate-200 mt-1">${stock.predictedPrice}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Confidence: {(stock.confidenceScore * 100).toFixed(0)}%</p>
                </div>
              </div>
            )) : (
              <p className="text-slate-400 text-sm italic">No predictions available yet.</p>
            )}
          </div>
          <button className="w-full mt-8 py-4 rounded-2xl bg-accent-green text-navy-900 font-bold hover:bg-accent-green/90 transition-all">
            Generate New Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
