import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { time: '09:30', price: 182.5 },
  { time: '10:30', price: 184.2 },
  { time: '11:30', price: 183.8 },
  { time: '12:30', price: 185.5 },
  { time: '13:30', price: 186.1 },
  { time: '14:30', price: 184.9 },
  { time: '15:30', price: 185.9 },
];

export default function StockChart({ symbol }: { symbol: string }) {
  return (
    <div className="h-[400px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#64FFDA" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#64FFDA" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#8892B0" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
          />
          <YAxis 
            stroke="#8892B0" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            domain={['auto', 'auto']}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#112240', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#CCD6F6'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="#64FFDA" 
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
