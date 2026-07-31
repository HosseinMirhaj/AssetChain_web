import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  Percent, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight,
  Coins, 
  Building2, 
  Factory, 
  Landmark, 
  Globe, 
  Sparkles,
  Info,
  Calendar,
  Activity,
  Lock
} from 'lucide-react';

interface YieldChartProps {
  theme: 'dark' | 'light';
  lang: 'fa' | 'en';
  isPortfolioMode?: boolean;
  isLoggedIn?: boolean;
  onLoginClick?: () => void;
  myPortfolio?: any[];
}

interface PricePoint {
  date: string;
  dateFa: string;
  price: number;
}

// Highly customized historical portfolio trend data
const PORTFOLIO_TRENDS_DATA: Record<'monthly' | 'threeMonth' | 'annual', PricePoint[]> = {
  monthly: [
    { date: 'Jun 05', dateFa: '۱۵ خرداد', price: 7420 },
    { date: 'Jun 10', dateFa: '۲۰ خرداد', price: 7510 },
    { date: 'Jun 15', dateFa: '۲۵ خرداد', price: 7680 },
    { date: 'Jun 20', dateFa: '۳۰ خرداد', price: 7850 },
    { date: 'Jun 25', dateFa: '۰۵ تیر', price: 8120 },
    { date: 'Jun 30', dateFa: '۱۰ تیر', price: 8240 },
    { date: 'Jul 04', dateFa: '۱۴ تیر', price: 8319.40 }
  ],
  threeMonth: [
    { date: 'Apr 05', dateFa: '۱۷ فروردین', price: 6200 },
    { date: 'Apr 20', dateFa: '۳۱ فروردین', price: 6450 },
    { date: 'May 05', dateFa: '۱۵ اردیبهشت', price: 6800 },
    { date: 'May 20', dateFa: '۳۰ اردیبهشت', price: 7100 },
    { date: 'Jun 05', dateFa: '۱۵ خرداد', price: 7420 },
    { date: 'Jun 20', dateFa: '۳۰ خرداد', price: 7850 },
    { date: 'Jul 04', dateFa: '۱۴ تیر', price: 8319.40 }
  ],
  annual: [
    { date: 'Jul 25', dateFa: 'مرداد ۱۴۰۴', price: 3400 },
    { date: 'Sep 25', dateFa: 'مهر ۱۴۰۴', price: 4100 },
    { date: 'Nov 25', dateFa: 'آذر ۱۴۰۴', price: 4900 },
    { date: 'Jan 25', dateFa: 'بهمن ۱۴۰۴', price: 5800 },
    { date: 'Mar 25', dateFa: 'اسفند ۱۴۰۴', price: 6600 },
    { date: 'May 25', dateFa: 'اردیبهشت ۱۴۰۵', price: 7500 },
    { date: 'Jul 04', dateFa: 'تیر ۱۴۰۵', price: 8319.40 }
  ]
};

// Highly customized historical price trend data for RWA Assets
const PRICE_TRENDS_DATA: Record<string, Record<'monthly' | 'threeMonth' | 'annual', PricePoint[]>> = {
  gold: {
    monthly: [
      { date: 'Jun 05', dateFa: '۱۵ خرداد', price: 2280 },
      { date: 'Jun 10', dateFa: '۲۰ خرداد', price: 2310 },
      { date: 'Jun 15', dateFa: '۲۵ خرداد', price: 2305 },
      { date: 'Jun 20', dateFa: '۳۰ خرداد', price: 2340 },
      { date: 'Jun 25', dateFa: '۰۵ تیر', price: 2380 },
      { date: 'Jun 30', dateFa: '۱۰ تیر', price: 2375 },
      { date: 'Jul 04', dateFa: '۱۴ تیر', price: 2442.5 }
    ],
    threeMonth: [
      { date: 'Apr 05', dateFa: '۱۷ فروردین', price: 2150 },
      { date: 'Apr 20', dateFa: '۳۱ فروردین', price: 2190 },
      { date: 'May 05', dateFa: '۱۵ اردیبهشت', price: 2240 },
      { date: 'May 20', dateFa: '۳۰ اردیبهشت', price: 2210 },
      { date: 'Jun 05', dateFa: '۱۵ خرداد', price: 2280 },
      { date: 'Jun 20', dateFa: '۳۰ خرداد', price: 2340 },
      { date: 'Jul 04', dateFa: '۱۴ تیر', price: 2442.5 }
    ],
    annual: [
      { date: 'Jul 25', dateFa: 'مرداد ۱۴۰۴', price: 1910 },
      { date: 'Sep 25', dateFa: 'مهر ۱۴۰۴', price: 1980 },
      { date: 'Nov 25', dateFa: 'آذر ۱۴۰۴', price: 2040 },
      { date: 'Jan 25', dateFa: 'بهمن ۱۴۰۴', price: 2110 },
      { date: 'Mar 25', dateFa: 'اسفند ۱۴۰۴', price: 2220 },
      { date: 'May 25', dateFa: 'اردیبهشت ۱۴۰۵', price: 2310 },
      { date: 'Jul 04', dateFa: 'تیر ۱۴۰۵', price: 2442.5 }
    ]
  },
  real_estate: {
    monthly: [
      { date: 'Jun 05', dateFa: '۱۵ خرداد', price: 152.0 },
      { date: 'Jun 10', dateFa: '۲۰ خرداد', price: 153.5 },
      { date: 'Jun 15', dateFa: '۲۵ خرداد', price: 155.0 },
      { date: 'Jun 20', dateFa: '۳۰ خرداد', price: 158.2 },
      { date: 'Jun 25', dateFa: '۰۵ تیر', price: 161.0 },
      { date: 'Jun 30', dateFa: '۱۰ تیر', price: 162.5 },
      { date: 'Jul 04', dateFa: '۱۴ تیر', price: 165.4 }
    ],
    threeMonth: [
      { date: 'Apr 05', dateFa: '۱۷ فروردین', price: 145.0 },
      { date: 'Apr 20', dateFa: '۳۱ فروردین', price: 148.0 },
      { date: 'May 05', dateFa: '۱۵ اردیبهشت', price: 150.5 },
      { date: 'May 20', dateFa: '۳۰ اردیبهشت', price: 152.0 },
      { date: 'Jun 05', dateFa: '۱۵ خرداد', price: 155.0 },
      { date: 'Jun 20', dateFa: '۳۰ خرداد', price: 160.2 },
      { date: 'Jul 04', dateFa: '۱۴ تیر', price: 165.4 }
    ],
    annual: [
      { date: 'Jul 25', dateFa: 'مرداد ۱۴۰۴', price: 130.0 },
      { date: 'Sep 25', dateFa: 'مهر ۱۴۰۴', price: 134.5 },
      { date: 'Nov 25', dateFa: 'آذر ۱۴۰۴', price: 139.0 },
      { date: 'Jan 25', dateFa: 'بهمن ۱۴۰۴', price: 144.0 },
      { date: 'Mar 25', dateFa: 'اسفند ۱۴۰۴', price: 150.0 },
      { date: 'May 25', dateFa: 'اردیبهشت ۱۴۰۵', price: 157.5 },
      { date: 'Jul 04', dateFa: 'تیر ۱۴۰۵', price: 165.4 }
    ]
  },
  petro: {
    monthly: [
      { date: 'Jun 05', dateFa: '۱۵ خرداد', price: 88.2 },
      { date: 'Jun 10', dateFa: '۲۰ خرداد', price: 89.0 },
      { date: 'Jun 15', dateFa: '۲۵ خرداد', price: 87.5 },
      { date: 'Jun 20', dateFa: '۳۰ خرداد', price: 90.1 },
      { date: 'Jun 25', dateFa: '۰۵ تیر', price: 91.4 },
      { date: 'Jun 30', dateFa: '۱۰ تیر', price: 90.8 },
      { date: 'Jul 04', dateFa: '۱۴ تیر', price: 92.3 }
    ],
    threeMonth: [
      { date: 'Apr 05', dateFa: '۱۷ فروردین', price: 84.5 },
      { date: 'Apr 20', dateFa: '۳۱ فروردین', price: 86.0 },
      { date: 'May 05', dateFa: '۱۵ اردیبهشت', price: 85.2 },
      { date: 'May 20', dateFa: '۳۰ اردیبهشت', price: 88.0 },
      { date: 'Jun 05', dateFa: '۱۵ خرداد', price: 89.5 },
      { date: 'Jun 20', dateFa: '۳۰ خرداد', price: 91.0 },
      { date: 'Jul 04', dateFa: '۱۴ تیر', price: 92.3 }
    ],
    annual: [
      { date: 'Jul 25', dateFa: 'مرداد ۱۴۰۴', price: 74.0 },
      { date: 'Sep 25', dateFa: 'مهر ۱۴۰۴', price: 77.2 },
      { date: 'Nov 25', dateFa: 'آذر ۱۴۰۴', price: 81.0 },
      { date: 'Jan 25', dateFa: 'بهمن ۱۴۰۴', price: 83.5 },
      { date: 'Mar 25', dateFa: 'اسفند ۱۴۰۴', price: 86.0 },
      { date: 'May 25', dateFa: 'اردیبهشت ۱۴۰۵', price: 89.8 },
      { date: 'Jul 04', dateFa: 'تیر ۱۴۰۵', price: 92.3 }
    ]
  },
  bank: {
    monthly: [
      { date: 'Jun 05', dateFa: '۱۵ خرداد', price: 1.16 },
      { date: 'Jun 10', dateFa: '۲۰ خرداد', price: 1.17 },
      { date: 'Jun 15', dateFa: '۲۵ خرداد', price: 1.18 },
      { date: 'Jun 20', dateFa: '۳۰ خرداد', price: 1.19 },
      { date: 'Jun 25', dateFa: '۰۵ تیر', price: 1.21 },
      { date: 'Jun 30', dateFa: '۱۰ تیر', price: 1.20 },
      { date: 'Jul 04', dateFa: '۱۴ تیر', price: 1.22 }
    ],
    threeMonth: [
      { date: 'Apr 05', dateFa: '۱۷ فروردین', price: 1.09 },
      { date: 'Apr 20', dateFa: '۳۱ فروردین', price: 1.11 },
      { date: 'May 05', dateFa: '۱۵ اردیبهشت', price: 1.13 },
      { date: 'May 20', dateFa: '۳۰ اردیبهشت', price: 1.15 },
      { date: 'Jun 05', dateFa: '۱۵ خرداد', price: 1.17 },
      { date: 'Jun 20', dateFa: '۳۰ خرداد', price: 1.19 },
      { date: 'Jul 04', dateFa: '۱۴ تیر', price: 1.22 }
    ],
    annual: [
      { date: 'Jul 25', dateFa: 'مرداد ۱۴۰۴', price: 0.95 },
      { date: 'Sep 25', dateFa: 'مهر ۱۴۰۴', price: 1.01 },
      { date: 'Nov 25', dateFa: 'آذر ۱۴۰۴', price: 1.05 },
      { date: 'Jan 25', dateFa: 'بهمن ۱۴۰۴', price: 1.10 },
      { date: 'Mar 25', dateFa: 'اسفند ۱۴۰۴', price: 1.14 },
      { date: 'May 25', dateFa: 'اردیبهشت ۱۴۰۵', price: 1.18 },
      { date: 'Jul 04', dateFa: 'تیر ۱۴۰۵', price: 1.22 }
    ]
  },
  global: {
    monthly: [
      { date: 'Jun 05', dateFa: '۱۵ خرداد', price: 448 },
      { date: 'Jun 10', dateFa: '۲۰ خرداد', price: 452 },
      { date: 'Jun 15', dateFa: '۲۵ خرداد', price: 450 },
      { date: 'Jun 20', dateFa: '۳۰ خرداد', price: 462 },
      { date: 'Jun 25', dateFa: '۰۵ تیر', price: 471 },
      { date: 'Jun 30', dateFa: '۱۰ تیر', price: 468 },
      { date: 'Jul 04', dateFa: '۱۴ تیر', price: 482 }
    ],
    threeMonth: [
      { date: 'Apr 05', dateFa: '۱۷ فروردین', price: 412 },
      { date: 'Apr 20', dateFa: '۳۱ فروردین', price: 425 },
      { date: 'May 05', dateFa: '۱۵ اردیبهشت', price: 432 },
      { date: 'May 20', dateFa: '۳۰ اردیبهشت', price: 428 },
      { date: 'Jun 05', dateFa: '۱۵ خرداد', price: 448 },
      { date: 'Jun 20', dateFa: '۳۰ خرداد', price: 462 },
      { date: 'Jul 04', dateFa: '۱۴ تیر', price: 482 }
    ],
    annual: [
      { date: 'Jul 25', dateFa: 'مرداد ۱۴۰۴', price: 365 },
      { date: 'Sep 25', dateFa: 'مهر ۱۴۰۴', price: 388 },
      { date: 'Nov 25', dateFa: 'آذر ۱۴۰۴', price: 405 },
      { date: 'Jan 25', dateFa: 'بهمن ۱۴۰۴', price: 422 },
      { date: 'Mar 25', dateFa: 'اسفند ۱۴۰۴', price: 442 },
      { date: 'May 25', dateFa: 'اردیبهشت ۱۴۰۵', price: 465 },
      { date: 'Jul 04', dateFa: 'تیر ۱۴۰۵', price: 482 }
    ]
  }
};

interface AssetMetadata {
  id: string;
  name: string;
  nameFa: string;
  shortName: string;
  shortNameFa: string;
  symbol: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  apy: number;
  unit: string;
  unitFa: string;
}

const ASSETS_LIST: AssetMetadata[] = [
  {
    id: 'gold',
    name: 'Metals & Gold Bar',
    nameFa: 'شمش طلا و فلزات گرانبها',
    shortName: 'Gold & Metals',
    shortNameFa: 'طلا و فلزات',
    symbol: 'RWA-GOLD',
    icon: <Coins className="text-amber-500" size={16} />,
    color: 'from-amber-500 to-yellow-600',
    bgColor: 'bg-amber-500/10',
    apy: 18.24,
    unit: 'USD/oz',
    unitFa: 'دلار بر انس'
  },
  {
    id: 'real_estate',
    name: 'Premium Real Estate',
    nameFa: 'املاک و مستغلات تجاری',
    shortName: 'Real Estate',
    shortNameFa: 'املاک تجاری',
    symbol: 'RWA-PROP',
    icon: <Building2 className="text-blue-500" size={16} />,
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-500/10',
    apy: 9.48,
    unit: 'USD/sqm',
    unitFa: 'دلار بر متر'
  },
  {
    id: 'petro',
    name: 'Petrochemical Industry',
    nameFa: 'صنایع نفت و پتروشیمی',
    shortName: 'Petrochemical',
    shortNameFa: 'نفت و پتروشیمی',
    symbol: 'RWA-CHEM',
    icon: <Factory className="text-emerald-500" size={16} />,
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-500/10',
    apy: 3.48,
    unit: 'USD/bbl',
    unitFa: 'دلار بر بشکه'
  },
  {
    id: 'bank',
    name: 'Financial & Banking',
    nameFa: 'صندوق‌های مالی و بانکی',
    shortName: 'Banking',
    shortNameFa: 'مالی و بانکی',
    symbol: 'RWA-BANK',
    icon: <Landmark className="text-purple-500" size={16} />,
    color: 'from-purple-500 to-fuchsia-600',
    bgColor: 'bg-purple-500/10',
    apy: 1.56,
    unit: 'USD/share',
    unitFa: 'دلار بر سهم'
  },
  {
    id: 'global',
    name: 'Global Equities',
    nameFa: 'دارایی‌های بین‌المللی',
    shortName: 'Global',
    shortNameFa: 'بین‌المللی',
    symbol: 'RWA-GLOB',
    icon: <Globe className="text-pink-500" size={16} />,
    color: 'from-pink-500 to-rose-600',
    bgColor: 'bg-pink-500/10',
    apy: 1.20,
    unit: 'USD/index',
    unitFa: 'شاخص جهانی'
  }
];

export default function YieldChart({ theme, lang, isPortfolioMode = false, isLoggedIn = false, onLoginClick, myPortfolio }: YieldChartProps) {
  const [activeAssetId, setActiveAssetId] = useState<string>('gold');
  const [activeTimeframe, setActiveTimeframe] = useState<'monthly' | 'threeMonth' | 'annual'>('annual');
  const [hoveredPoint, setHoveredPoint] = useState<PricePoint | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const isRtl = lang === 'fa';

  const activeAsset = ASSETS_LIST.find(a => a.id === activeAssetId) || ASSETS_LIST[0];

  // Dynamic calculations for scaling portfolio assets if logged in
  let actualCurrentValue = 8319.40;
  if (isPortfolioMode && isLoggedIn && myPortfolio) {
    let sum = 0;
    myPortfolio.forEach(item => {
      let price = 0;
      if (item.assetId === 'GOLD') price = 1195.00;
      else if (item.assetId === 'JUMEIRAH') price = 250.00;
      else if (item.assetId === 'FOOLAD') price = 0.082;
      else if (item.assetId === 'BAHMAN') price = 110.00;
      else if (item.assetId === 'AAPL') price = 185.00;
      else if (item.assetId === 'TSLA') price = 220.00;
      else if (item.assetId === 'NVDA') price = 450.00;
      else price = item.avgPrice || 1.0;
      sum += item.shares * price;
    });
    if (sum > 0) {
      actualCurrentValue = sum;
    }
  }

  const rawPortfolioPoints = PORTFOLIO_TRENDS_DATA[activeTimeframe] || [];
  const finalRawPrice = rawPortfolioPoints[rawPortfolioPoints.length - 1]?.price || 8319.40;
  const scaleFactor = actualCurrentValue / finalRawPrice;

  const chartPoints = isPortfolioMode 
    ? rawPortfolioPoints.map(p => ({ ...p, price: p.price * scaleFactor }))
    : (PRICE_TRENDS_DATA[activeAssetId]?.[activeTimeframe] || []);

  // Price calculations
  const firstPrice = chartPoints[0]?.price || 0;
  const lastPrice = chartPoints[chartPoints.length - 1]?.price || 0;
  const priceDiff = lastPrice - firstPrice;
  const changePercent = firstPrice > 0 ? (priceDiff / firstPrice) * 100 : 0;

  // Find min and max prices to scale the SVG chart correctly
  const prices = chartPoints.map(p => p.price);
  const minPrice = Math.min(...prices) * 0.98; // Add small padding bottom
  const maxPrice = Math.max(...prices) * 1.02; // Add small padding top
  const priceRange = maxPrice - minPrice;

  // Chart dimensions inside the responsive container
  const width = 600;
  const height = 180;
  const paddingX = 25;
  const paddingY = 20;

  // Map data points to SVG coordinates
  const svgPoints = chartPoints.map((point, index) => {
    const x = paddingX + (index / (chartPoints.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - ((point.price - minPrice) / priceRange) * (height - 2 * paddingY);
    return { x, y, point, index };
  });

  // Construct bezier path for high-fidelity smooth curves
  const getBezierPath = () => {
    if (svgPoints.length === 0) return '';
    let path = `M ${svgPoints[0].x} ${svgPoints[0].y}`;
    for (let i = 0; i < svgPoints.length - 1; i++) {
      const p0 = svgPoints[i];
      const p1 = svgPoints[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 3;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (2 * (p1.x - p0.x)) / 3;
      const cpY2 = p1.y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  const getAreaPath = () => {
    const linePath = getBezierPath();
    if (!linePath) return '';
    const firstX = svgPoints[0].x;
    const lastX = svgPoints[svgPoints.length - 1].x;
    return `${linePath} L ${lastX} ${height} L ${firstX} ${height} Z`;
  };

  // Handle pointer tracking over the SVG
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!containerRef.current) return;
    const svgRect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - svgRect.left;
    
    // Find closest index
    let closestIndex = 0;
    let minDiff = Infinity;
    
    svgPoints.forEach((pt, idx) => {
      const diff = Math.abs(pt.x - (clientX * (width / svgRect.width)));
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = idx;
      }
    });

    setHoveredIndex(closestIndex);
    setHoveredPoint(chartPoints[closestIndex]);
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
    setHoveredIndex(null);
  };

  const activeDisplayPrice = hoveredPoint ? hoveredPoint.price : lastPrice;
  const activeDisplayDate = hoveredPoint ? (isRtl ? hoveredPoint.dateFa : hoveredPoint.date) : (isRtl ? 'امروز' : 'Today');

  return (
    <div 
      id="yield-price-chart-container"
      ref={containerRef}
      className={`p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden shadow-md ${
        theme === 'dark' 
          ? 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700/80' 
          : 'bg-white border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Decorative Radial Lighting */}
      <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-amber-500/5 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col space-y-6">
        
        {/* Row 1: Header - Asset metadata and Timeframe selection */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 animate-pulse">
                <Activity size={16} />
              </span>
              <h2 className={`text-sm md:text-base font-black tracking-tight ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>
                {isPortfolioMode 
                  ? (isRtl ? 'نمودار عملکرد و رشد ارزش سبد دارایی‌ها' : 'Asset Portfolio Growth & Performance Chart')
                  : (isRtl ? 'نمودار زنده و تحلیل تکنیکال قیمت دارایی‌های واقعی' : 'Live Real-World Asset (RWA) Price Chart')}
              </h2>
            </div>
            <p className={`text-[10px] md:text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              {isPortfolioMode 
                ? (isRtl 
                    ? 'تحلیل ارزش کل دارایی‌های واقعی (RWA) و میزان سود نقدی انباشته حساب کاربری شما' 
                    : 'Historical analysis of your total physical asset value and passive yields')
                : (isRtl 
                    ? 'نمودار نوسانات قیمت لحظه‌ای و روند بازار بر اساس استانداردهای حسابرسی شده بین‌المللی'
                    : 'Real-time market price charts and volume analytics of verified physical reserves')}
            </p>
          </div>

          {/* Timeframe selector tabs */}
          <div className={`flex flex-nowrap shrink-0 p-1 rounded-xl self-start md:self-auto border ${
            theme === 'dark' ? 'bg-slate-950/60 border-slate-800/50' : 'bg-slate-100 border-slate-200'
          }`} dir={isRtl ? 'rtl' : 'ltr'}>
            <button
              onClick={() => setActiveTimeframe('monthly')}
              className={`px-3 py-1.5 text-[10px] md:text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTimeframe === 'monthly'
                  ? 'bg-blue-600 text-white shadow-md'
                  : theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              {isRtl ? '۳۰ روزه' : '30D'}
            </button>
            <button
              onClick={() => setActiveTimeframe('threeMonth')}
              className={`px-3 py-1.5 text-[10px] md:text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTimeframe === 'threeMonth'
                  ? 'bg-blue-600 text-white shadow-md'
                  : theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              {isRtl ? '۹۰ روزه' : '90D'}
            </button>
            <button
              onClick={() => setActiveTimeframe('annual')}
              className={`px-3 py-1.5 text-[10px] md:text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTimeframe === 'annual'
                  ? 'bg-blue-600 text-white shadow-md'
                  : theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              {isRtl ? 'یک‌ساله (APY)' : '1Y (APY)'}
            </button>
          </div>
        </div>

        {/* Row 2: Asset Switcher Pills / Portfolio Allocations */}
        {isPortfolioMode ? (
          <div className="flex flex-wrap items-center gap-3" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${
              theme === 'dark' ? 'bg-slate-950/40 border-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
              <span>{isRtl ? 'طلای فیزیکی: ۴۳٪' : 'Physical Gold: 43%'}</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${
              theme === 'dark' ? 'bg-slate-950/40 border-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0"></span>
              <span>{isRtl ? 'ملک ساحلی دبی: ۴۵٪' : 'Dubai Beach Villa: 45%'}</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${
              theme === 'dark' ? 'bg-slate-950/40 border-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span>{isRtl ? 'صنایع فلزی و فولاد: ۱۲٪' : 'Steel Industries: 12%'}</span>
            </div>
          </div>
        ) : (
          <div 
            className="flex items-center gap-2 overflow-x-auto pb-2 w-full max-w-full scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent snap-x"
            dir={isRtl ? 'rtl' : 'ltr'}
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {ASSETS_LIST.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveAssetId(item.id);
                  setHoveredPoint(null);
                  setHoveredIndex(null);
                }}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap shrink-0 snap-center ${
                  activeAssetId === item.id
                    ? theme === 'dark'
                      ? 'bg-blue-600/15 border-blue-500/50 text-blue-400 shadow-md shadow-blue-500/5'
                      : 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm'
                    : theme === 'dark'
                      ? 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:text-slate-900 hover:border-slate-200'
                }`}
              >
                <span className={`p-1.5 rounded-lg shrink-0 ${item.bgColor}`}>{item.icon}</span>
                <span className="shrink-0">{isRtl ? item.shortNameFa : item.shortName}</span>
                <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded shrink-0 ${
                  theme === 'dark' ? 'bg-slate-900 text-slate-300' : 'bg-white text-slate-500 border border-slate-200'
                }`}>
                  {item.symbol}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Row 3: Live Price Information Box */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-4 border-slate-800/30" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
              {isPortfolioMode 
                ? (isRtl ? 'ارزش تقریبی کل سبد دارایی بر اساس قیمت زنده' : 'Estimated Total Portfolio Value based on live prices')
                : `${isRtl ? activeAsset.nameFa : activeAsset.name} • ${activeAsset.symbol} / ${isRtl ? 'دلار مرجع' : 'USD'}`}
            </span>
            <div className="flex items-baseline gap-3">
              <span className={`text-2xl md:text-4xl font-black font-mono tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                ${activeDisplayPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded-lg flex items-center gap-0.5 ${
                changePercent >= 0 
                  ? 'bg-emerald-500/10 text-emerald-500' 
                  : 'bg-rose-500/10 text-rose-500'
              }`}>
                {changePercent >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                <span className="font-mono">{changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
              <span>{isRtl ? 'زمان قیمت‌گذاری:' : 'Price Point Date:'}</span>
              <span className="font-bold text-slate-300">{activeDisplayDate}</span>
              {hoveredPoint && (
                <span className="animate-pulse text-blue-500 font-bold">({isRtl ? 'در حال بررسی نوسان' : 'Interacting'})</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-right">
              <p className="text-[9px] text-slate-400">{isRtl ? 'پایین‌ترین سطح' : 'LOWEST'}</p>
              <p className={`font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                ${minPrice.toFixed(1)}
              </p>
            </div>
            <div className="w-[1px] h-6 bg-slate-800/40"></div>
            <div className="text-right">
              <p className="text-[9px] text-slate-400">{isRtl ? 'بالاترین سطح' : 'HIGHEST'}</p>
              <p className={`font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                ${maxPrice.toFixed(1)}
              </p>
            </div>
            <div className="w-[1px] h-6 bg-slate-800/40"></div>
            <div className="text-right">
              <p className="text-[9px] text-slate-400">{isPortfolioMode ? (isRtl ? 'متوسط سود انباشته' : 'ACCUMULATED APY') : (isRtl ? 'نرخ بازده سود' : 'ANNUAL APY')}</p>
              <p className="font-extrabold text-blue-500">
                {isPortfolioMode ? '16.45%' : `${activeAsset.apy.toFixed(2)}%`}
              </p>
            </div>
          </div>
        </div>

        {/* Row 4: THE PRICE AREA CHART (Interactive SVG) */}
        <div className="relative">
          {isPortfolioMode && !isLoggedIn && (
            <div className="absolute inset-x-4 bottom-4 top-4 z-20 flex flex-col items-center justify-center bg-slate-950/45 backdrop-blur-md rounded-2xl border border-slate-800/80 text-center p-6 space-y-4">
              <div className="p-3 bg-blue-500/10 rounded-full text-blue-500">
                <Lock size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-white font-extrabold text-sm md:text-base">
                  {isRtl ? 'مشاهده سبد دارایی شخصی و میزان سود دهی' : 'View Your Personal Portfolio Performance'}
                </h3>
                <p className="text-slate-400 text-xs max-w-md">
                  {isRtl 
                    ? 'جهت اتصال کیف پول و بررسی دارایی‌های توکنایز شده خود و نمودار بازدهی واقعی آن‌ها وارد حساب خود شوید.'
                    : 'Connect your secure account to view your exact tokenized assets, distribution ratios, and live yields.'}
                </p>
              </div>
              <button 
                onClick={onLoginClick}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-blue-500/10"
              >
                {isRtl ? 'ورود یا ثبت‌نام سریع' : 'Sign In / Sign Up Now'}
              </button>
            </div>
          )}

          <svg 
            viewBox={`0 0 ${width} ${height}`} 
            className={`w-full h-auto overflow-visible select-none ${isPortfolioMode && !isLoggedIn ? 'blur-sm pointer-events-none' : ''}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <defs>
              {/* Glow Area Gradient */}
              <linearGradient id={`gradient-${isPortfolioMode ? 'portfolio' : activeAsset.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isPortfolioMode ? '#3b82f6' : (activeAsset.id === 'gold' ? '#f59e0b' : '#3b82f6')} stopOpacity="0.25" />
                <stop offset="100%" stopColor={isPortfolioMode ? '#3b82f6' : (activeAsset.id === 'gold' ? '#f59e0b' : '#3b82f6')} stopOpacity="0.0" />
              </linearGradient>

              {/* Grid line pattern pattern */}
              <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 20" fill="none" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} strokeWidth="1" />
              </pattern>
            </defs>

            {/* Grid Pattern Pattern */}
            <rect width={width} height={height} fill="url(#grid)" opacity="0.4" />

            {/* Chart Area Fill with Gradient */}
            <path 
              d={getAreaPath()} 
              fill={`url(#gradient-${isPortfolioMode ? 'portfolio' : activeAsset.id})`} 
              className="transition-all duration-300"
            />

            {/* Price line path */}
            <motion.path 
              d={getBezierPath()} 
              fill="none" 
              stroke={isPortfolioMode ? '#3b82f6' : (activeAsset.id === 'gold' ? '#f59e0b' : '#3b82f6')} 
              strokeWidth="3.5" 
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />

            {/* Key Grid Guideline */}
            <line 
              x1="0" 
              y1={height - paddingY} 
              x2={width} 
              y2={height - paddingY} 
              stroke={theme === 'dark' ? '#334155' : '#cbd5e1'} 
              strokeWidth="1" 
              strokeDasharray="4,4" 
            />

            {/* Horizontal Grid lines with prices */}
            <g className="text-[8px] fill-slate-500 font-mono" opacity="0.7">
              <text x="8" y={paddingY + 5}>${maxPrice.toFixed(0)}</text>
              <text x="8" y={height / 2 + 3}>${((maxPrice + minPrice) / 2).toFixed(0)}</text>
              <text x="8" y={height - paddingY - 3}>${minPrice.toFixed(0)}</text>
            </g>

            {/* Interactive Tracking Line & Dot */}
            {hoveredIndex !== null && svgPoints[hoveredIndex] && (
              <g>
                {/* Vertical Tracker Dashline */}
                <line 
                  x1={svgPoints[hoveredIndex].x} 
                  y1="0" 
                  x2={svgPoints[hoveredIndex].x} 
                  y2={height} 
                  stroke="#3b82f6" 
                  strokeWidth="1.5" 
                  strokeDasharray="3,3" 
                  className="transition-all duration-75"
                />

                {/* Outer pulsing ring */}
                <circle 
                  cx={svgPoints[hoveredIndex].x} 
                  cy={svgPoints[hoveredIndex].y} 
                  r="9" 
                  fill={isPortfolioMode ? '#3b82f6' : (activeAsset.id === 'gold' ? '#f59e0b' : '#3b82f6')} 
                  opacity="0.25"
                  className="transition-all duration-75"
                />

                {/* Inner solid tracking dot */}
                <circle 
                  cx={svgPoints[hoveredIndex].x} 
                  cy={svgPoints[hoveredIndex].y} 
                  r="4.5" 
                  fill={isPortfolioMode ? '#3b82f6' : (activeAsset.id === 'gold' ? '#f59e0b' : '#3b82f6')} 
                  stroke={theme === 'dark' ? '#0f172a' : '#ffffff'} 
                  strokeWidth="2"
                  className="transition-all duration-75 animate-ping-once"
                />
              </g>
            )}

            {/* X-Axis labels */}
            <g className="text-[8px] fill-slate-400 font-bold" opacity="0.8">
              {svgPoints.map((pt, idx) => {
                // Render first, middle, and last labels to avoid crowding
                if (idx === 0 || idx === Math.floor(svgPoints.length / 2) || idx === svgPoints.length - 1) {
                  return (
                    <text 
                      key={idx} 
                      x={pt.x} 
                      y={height - 4} 
                      textAnchor={idx === 0 ? 'start' : idx === svgPoints.length - 1 ? 'end' : 'middle'}
                    >
                      {isRtl ? pt.point.dateFa : pt.point.date}
                    </text>
                  );
                }
                return null;
              })}
            </g>
          </svg>
        </div>

        {/* Row 5: Financial Metrics & Audit Info (Swapped BELOW the chart) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4 border-slate-800/30" dir={isRtl ? 'rtl' : 'ltr'}>
          
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            theme === 'dark' ? 'bg-slate-950/20 border-slate-800/40' : 'bg-slate-50 border-slate-100'
          }`}>
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-slate-400">
                {isRtl ? 'کل میانگین بازدهی دوره' : 'Overall Average Period Return'}
              </p>
              <h3 className={`text-base md:text-lg font-black ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                16.45% APY
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Percent size={16} />
            </div>
          </div>

          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            theme === 'dark' ? 'bg-slate-950/20 border-slate-800/40' : 'bg-slate-50 border-slate-100'
          }`}>
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-slate-400">
                {isRtl ? 'تضمین فیزیکی وثیقه‌ها' : 'Collateral Reservation Tier'}
              </p>
              <h3 className={`text-base md:text-lg font-black ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}>
                {isRtl ? 'شمش طلای استاندارد ۲۴ عیار' : 'Standard 24K Gold Bullion'}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
              <Sparkles size={16} />
            </div>
          </div>

          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            theme === 'dark' ? 'bg-slate-950/20 border-slate-800/40' : 'bg-slate-50 border-slate-100'
          }`}>
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-slate-400">
                {isRtl ? 'اعتبارسنجی حسابرسی فیزیکی' : 'Auditing Audit Level'}
              </p>
              <h3 className={`text-xs md:text-sm font-black ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                {isRtl ? '۱۰۰٪ حسابرسی شده معتبر بیمه‌دار' : '100% Fully Insured & Audited'}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
              <ShieldCheck size={16} />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
