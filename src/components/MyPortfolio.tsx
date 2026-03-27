import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, Layers, Target, Shield, Zap, TrendingUp, Scale, AlertCircle, Plus, X, Save, User as UserIcon, Phone, MapPin, Globe, Mail, Calendar } from 'lucide-react';
import { User, Portfolio, PortfolioComponent } from '../types';
import { db } from '../firebase';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore';

export default function MyPortfolio({ user }: { user: User }) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    portfolioName: '',
    name: user.name || '',
    age: user.age || '',
    phoneNumber: user.phoneNumber || '',
    address: user.address || '',
    country: user.country || '',
    email: user.email || '',
    components: [
      { type: 'Equities', name: '', value: 0, description: 'Individual shares of companies, ranging from large-cap blue-chip stocks to growth-oriented small-cap stocks.' },
      { type: 'Fixed Income', name: '', value: 0, description: 'Government or corporate bonds that provide stability, regular interest income, and lower risk.' },
      { type: 'Mutual Funds', name: '', value: 0, description: 'Pooled investment vehicles that provide instant diversification across sectors or asset classes.' },
      { type: 'Cash', name: '', value: 0, description: 'Highly liquid assets such as money market funds or bank deposits for emergencies or liquidity.' },
      { type: 'Alternative', name: '', value: 0, description: 'Assets like REITs, commodities (gold), or derivatives for further diversification and hedging.' }
    ] as PortfolioComponent[]
  });

  useEffect(() => {
    const q = query(collection(db, 'portfolios'), where('userId', '==', user.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const pList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Portfolio));
      setPortfolios(pList);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user.id]);

  const handleCreatePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const totalValue = formData.components.reduce((acc, curr) => acc + Number(curr.value), 0);
      await addDoc(collection(db, 'portfolios'), {
        userId: user.id,
        name: formData.portfolioName,
        components: formData.components,
        totalValue,
        createdAt: new Date().toISOString(),
        personalInfo: {
          name: formData.name,
          age: Number(formData.age),
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          country: formData.country,
          email: formData.email
        }
      });
      setShowCreateForm(false);
      setFormData({
        ...formData,
        portfolioName: '',
        components: formData.components.map(c => ({ ...c, value: 0, name: '' }))
      });
    } catch (error) {
      console.error("Error creating portfolio:", error);
    }
  };

  const handleComponentChange = (index: number, field: keyof PortfolioComponent, value: any) => {
    const newComponents = [...formData.components];
    newComponents[index] = { ...newComponents[index], [field]: value };
    setFormData({ ...formData, components: newComponents });
  };

  const types = [
    { title: "Growth Portfolio", desc: "Focuses on high-growth companies or sectors to maximize capital appreciation.", icon: TrendingUp },
    { title: "Income Portfolio", desc: "Concentrates on assets generating steady cash flow, such as dividends or bonds.", icon: Layers },
    { title: "Balanced Portfolio", desc: "A hybrid approach blending equities and fixed-income for stability and growth.", icon: Scale },
    { title: "Aggressive Portfolio", desc: "Primarily equity-oriented, aimed at high returns for high risk tolerance.", icon: Zap }
  ];

  const aspects = [
    { title: "Composition", desc: "Primarily stocks (equity) for growth, plus bonds (debt) for stability.", icon: Layers },
    { title: "Purpose", desc: "Tailored to an individual’s risk tolerance, time horizon, and goals.", icon: Target },
    { title: "Key Concept", desc: "Diversification helps reduce the impact of poor performance from any single investment.", icon: Shield }
  ];

  return (
    <div className="p-8 space-y-12 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-200">My Portfolio</h1>
          <p className="text-slate-400">Manage and track your investment baskets.</p>
        </div>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-brand-accent text-white font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-accent/20"
        >
          <Plus size={20} />
          Create New Portfolio
        </button>
      </header>

      {/* Portfolios List */}
      {portfolios.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
            <Briefcase className="text-brand-accent" size={20} />
            Active Portfolios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((p) => (
              <motion.div
                key={p.id}
                className="glass p-6 rounded-3xl border border-white/5 hover:border-brand-accent/30 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-slate-200 group-hover:text-brand-accent transition-colors">{p.name}</h3>
                  <span className="text-xs text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-sm text-slate-400 font-medium">Total Value</span>
                    <span className="text-2xl font-bold text-slate-200">${p.totalValue.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-brand-bg rounded-full overflow-hidden flex">
                    {p.components.map((c, i) => (
                      <div 
                        key={i}
                        style={{ width: `${(c.value / p.totalValue) * 100}%` }}
                        className={`h-full ${
                          c.type === 'Equities' ? 'bg-blue-500' :
                          c.type === 'Fixed Income' ? 'bg-emerald-500' :
                          c.type === 'Mutual Funds' ? 'bg-amber-500' :
                          c.type === 'Cash' ? 'bg-slate-500' : 'bg-purple-500'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {p.components.filter(c => c.value > 0).map((c, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 bg-white/5 rounded-full text-slate-400 border border-white/5">
                        {c.type}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Create Portfolio Modal */}
      <AnimatePresence>
        {showCreateForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[40px] border border-white/10 p-8 md:p-12 relative"
            >
              <button 
                onClick={() => setShowCreateForm(false)}
                className="absolute top-8 right-8 p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <form onSubmit={handleCreatePortfolio} className="space-y-10">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-200">Create Your Portfolio</h2>
                  
                  {/* Personal Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <UserIcon size={14} /> Full Name
                      </label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-brand-bg border border-white/5 rounded-xl px-4 py-3 text-slate-200 focus:border-brand-accent outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <Calendar size={14} /> Age
                      </label>
                      <input 
                        type="number" 
                        required
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="w-full bg-brand-bg border border-white/5 rounded-xl px-4 py-3 text-slate-200 focus:border-brand-accent outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <Phone size={14} /> Phone Number
                      </label>
                      <input 
                        type="tel" 
                        required
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="w-full bg-brand-bg border border-white/5 rounded-xl px-4 py-3 text-slate-200 focus:border-brand-accent outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <Mail size={14} /> Email Address
                      </label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-brand-bg border border-white/5 rounded-xl px-4 py-3 text-slate-200 focus:border-brand-accent outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <MapPin size={14} /> Address
                      </label>
                      <input 
                        type="text" 
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full bg-brand-bg border border-white/5 rounded-xl px-4 py-3 text-slate-200 focus:border-brand-accent outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <Globe size={14} /> Country
                      </label>
                      <input 
                        type="text" 
                        required
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full bg-brand-bg border border-white/5 rounded-xl px-4 py-3 text-slate-200 focus:border-brand-accent outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <Briefcase size={14} /> Portfolio Name
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Retirement Fund"
                        value={formData.portfolioName}
                        onChange={(e) => setFormData({ ...formData, portfolioName: e.target.value })}
                        className="w-full bg-brand-bg border border-white/5 rounded-xl px-4 py-3 text-slate-200 focus:border-brand-accent outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-200">Key Components</h3>
                  <div className="space-y-4">
                    {formData.components.map((comp, idx) => (
                      <div key={comp.type} className="glass p-6 rounded-2xl border border-white/5 space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <h4 className="font-bold text-slate-200">{comp.type}</h4>
                            <p className="text-xs text-slate-500 max-w-md">{comp.description}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase tracking-wider text-slate-500">Asset Name</label>
                              <input 
                                type="text"
                                placeholder="e.g. Apple Inc."
                                value={comp.name}
                                onChange={(e) => handleComponentChange(idx, 'name', e.target.value)}
                                className="bg-brand-bg border border-white/5 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-brand-accent outline-none transition-colors w-40"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase tracking-wider text-slate-500">Value ($)</label>
                              <input 
                                type="number"
                                value={comp.value}
                                onChange={(e) => handleComponentChange(idx, 'value', e.target.value)}
                                className="bg-brand-bg border border-white/5 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-brand-accent outline-none transition-colors w-32"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <button 
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-8 py-3 text-slate-400 font-bold hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex items-center gap-2 px-10 py-3 bg-brand-accent text-white font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-accent/20"
                  >
                    <Save size={20} />
                    Save Portfolio
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <header className="pt-12">
        <div className="glass p-8 rounded-3xl border border-white/5">
          <p className="text-slate-300 leading-relaxed text-lg">
            A stock market portfolio is a curated collection of financial assets—including stocks, bonds, 
            mutual funds, ETFs, and cash—owned by an investor to achieve specific financial goals. 
            It acts as a <span className="text-brand-accent font-bold">"basket"</span> designed to manage risk through diversification.
          </p>
        </div>
      </header>

      <section>
        <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2">
          <Layers className="text-brand-accent" size={20} />
          Key Aspects of a Portfolio
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aspects.map((aspect, idx) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={aspect.title}
              className="glass p-6 rounded-2xl border border-white/5"
            >
              <aspect.icon className="text-brand-accent mb-4" size={24} />
              <h3 className="font-bold text-slate-200 mb-2">{aspect.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{aspect.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2">
          <Briefcase className="text-brand-accent" size={20} />
          Portfolio Types & Strategies
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {types.map((type, idx) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              key={type.title}
              className="glass p-6 rounded-2xl border border-white/5 hover:border-brand-accent/30 transition-colors"
            >
              <type.icon className="text-slate-400 mb-4" size={24} />
              <h3 className="font-bold text-slate-200 mb-2">{type.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{type.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
        <div className="glass p-8 rounded-3xl border border-white/5 bg-accent-green/5">
          <h2 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
            <Shield className="text-accent-green" size={20} />
            Why Build a Portfolio?
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Building a portfolio helps spread risk across multiple sectors, allowing investors to cushion 
            their investments against market volatility and improve risk-adjusted returns.
          </p>
        </div>

        <div className="glass p-8 rounded-3xl border border-white/5">
          <h2 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
            <AlertCircle className="text-slate-400" size={20} />
            Common Synonyms
          </h2>
          <div className="flex flex-wrap gap-2">
            {["Investment Basket", "Investment Mix", "Holdings", "Asset Allocation", "Fund"].map(s => (
              <span key={s} className="px-3 py-1 bg-white/5 rounded-full text-xs text-slate-400 border border-white/5">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
