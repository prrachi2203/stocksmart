import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BarChart3, PieChart, TrendingUp, ShieldCheck, Globe, Briefcase, Search, ChevronRight, Info } from 'lucide-react';
import { User, Portfolio } from '../types';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function MarketAnalysis({ user }: { user: User }) {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'portfolios'), where('userId', '==', user.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const pList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Portfolio));
      setPortfolios(pList);
    });
    return () => unsubscribe();
  }, [user.id]);

  const sections = [
    {
      title: "Fundamental Analysis (Long-term Value)",
      icon: PieChart,
      items: [
        { name: "Financial Statement Analysis", desc: "Analyzing income statements, balance sheets, and cash flow to determine profitability and liquidity." },
        { name: "Valuation Ratios", desc: "Earnings per Share (EPS), Price-to-Earnings (P/E), Price-to-Book (P/B), and Price/Earnings to Growth (PEG)." },
        { name: "Macroeconomic Analysis", desc: "Evaluating GDP growth, interest rates, inflation, and government policies." },
        { name: "Industry Trends", desc: "Assessing sector performance and competitive advantage (e.g., Porter’s Five Forces)." }
      ]
    },
    {
      title: "Technical Analysis (Short-term Price Movement)",
      icon: TrendingUp,
      items: [
        { name: "Chart Types", desc: "Candlestick charts, line charts, and bar charts." },
        { name: "Price Patterns", desc: "Identifying support & resistance levels, trend lines, head and shoulders, and triangles." },
        { name: "Technical Indicators", desc: "Moving Averages (MA), Relative Strength Index (RSI), MACD, and Bollinger Bands." },
        { name: "Price-Volume Analysis", desc: "Studying trading volume to confirm trend strength." }
      ]
    },
    {
      title: "Quantitative & Sentiment Analysis",
      icon: BarChart3,
      items: [
        { name: "Quantitative Analysis", desc: "Using mathematical and statistical modeling to find trading opportunities." },
        { name: "Sentiment Analysis", desc: "Gauging market psychology (e.g., VIX volatility index, bullish/bearish ratios)." }
      ]
    },
    {
      title: "Specialized Topics",
      icon: ShieldCheck,
      items: [
        { name: "Derivative Analysis", desc: "Evaluating financial instruments like options and futures to hedge risk." },
        { name: "Top-down vs. Bottom-up", desc: "Starting with economic trends vs. focusing on individual companies." },
        { name: "Corporate Governance", desc: "Assessing leadership, ESG factors, and earnings announcements." }
      ]
    }
  ];

  return (
    <div className="p-8 space-y-12 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-200">Market Analysis</h1>
          <p className="text-slate-400 max-w-3xl leading-relaxed">
            Evaluate securities and portfolios through fundamental, technical, and sentiment analysis.
          </p>
        </div>
      </header>

      {/* Portfolio Analysis Tool */}
      <section className="glass p-8 rounded-[32px] border border-white/10 bg-brand-surface/30">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-1/3 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                <Search className="text-brand-accent" size={20} />
                Analyze My Portfolio
              </h2>
              <p className="text-sm text-slate-400">Select one of your portfolios to perform a deep market analysis.</p>
            </div>

            <div className="space-y-3">
              {portfolios.length === 0 ? (
                <div className="p-4 bg-white/5 rounded-xl border border-dashed border-white/10 text-center">
                  <p className="text-xs text-slate-500 italic">No portfolios found. Create one in the Portfolio section.</p>
                </div>
              ) : (
                portfolios.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPortfolio(p)}
                    className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                      selectedPortfolio?.id === p.id 
                        ? 'bg-brand-accent/20 border-brand-accent text-white' 
                        : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-bold text-sm">{p.name}</div>
                      <div className="text-[10px] opacity-60">${p.totalValue.toLocaleString()} • {p.components.filter(c => c.value > 0).length} Assets</div>
                    </div>
                    <ChevronRight size={16} className={`transition-transform ${selectedPortfolio?.id === p.id ? 'rotate-90' : ''}`} />
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="flex-1 min-h-[300px] flex flex-col">
            {selectedPortfolio ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-slate-200">{selectedPortfolio.name} Analysis</h3>
                  <button 
                    onClick={() => setIsAnalyzing(true)}
                    className="px-6 py-2 bg-brand-accent text-white text-sm font-bold rounded-xl hover:scale-105 active:scale-95 transition-all"
                  >
                    Run Full Analysis
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Asset Allocation</h4>
                    <div className="space-y-3">
                      {selectedPortfolio.components.filter(c => c.value > 0).map((c, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-300">{c.type} ({c.name})</span>
                            <span className="text-slate-500">{((c.value / selectedPortfolio.totalValue) * 100).toFixed(1)}%</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-brand-accent" 
                              style={{ width: `${(c.value / selectedPortfolio.totalValue) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Risk Assessment</h4>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full border-4 border-emerald-500/30 flex items-center justify-center text-emerald-500 font-bold">
                        Low
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-slate-200 font-bold">Diversified Mix</p>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Your portfolio has a healthy balance of {selectedPortfolio.components.filter(c => c.value > 0).length} different asset classes.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {isAnalyzing && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-brand-accent/10 border border-brand-accent/20 rounded-2xl space-y-4"
                  >
                    <div className="flex items-center gap-2 text-brand-accent">
                      <Info size={18} />
                      <span className="font-bold">AI Market Insights</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Based on current market trends, your <span className="text-white font-bold">{selectedPortfolio.name}</span> is well-positioned for long-term growth. 
                      We recommend monitoring the <span className="text-white font-bold">Equities</span> segment as macroeconomic factors suggest potential volatility in the coming quarter. 
                      Consider rebalancing your <span className="text-white font-bold">Fixed Income</span> assets if interest rates fluctuate.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                <div className="p-6 rounded-full bg-white/5">
                  <Briefcase size={48} className="text-slate-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-slate-300">No Portfolio Selected</p>
                  <p className="text-sm text-slate-500">Select a portfolio from the list to start analysis.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Educational Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {sections.map((section, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={section.title}
            className="glass p-8 rounded-3xl border border-white/5"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-brand-accent/10 text-brand-accent">
                <section.icon size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-200">{section.title}</h2>
            </div>
            <div className="space-y-6">
              {section.items.map((item) => (
                <div key={item.name} className="group">
                  <h4 className="font-bold text-slate-300 group-hover:text-brand-accent transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
