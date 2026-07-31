import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { INITIAL_ASSETS } from "./src/data.js";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Body parser middleware
  app.use(express.json());

  // In-memory backend database state for user sessions
  let dbAssets = [...INITIAL_ASSETS];
  let dbUsers: Record<string, {
    email: string;
    name: string;
    usdtBalance: number;
    tomanBalance: number;
    portfolio: Array<{ assetId: string; shares: number; avgPrice: number }>;
    purchaseLots: Array<{ id: string; assetId: string; shares: number; buyPrice: number; date: string }>;
    orders: Array<{ id: string; assetId: string; type: 'buy_limit' | 'sell_limit'; targetPrice: number; shares: number; status: string; date: string }>;
    alerts: Array<{ id: string; assetId: string; condition: 'above' | 'below'; targetPrice: number; status: string }>;
    activities: Array<{ id: string; type: string; titleEn: string; titleFa: string; timestamp: string }>;
  }> = {
    'demo@assetchain.io': {
      email: 'demo@assetchain.io',
      name: 'Demo Investor',
      usdtBalance: 12500,
      tomanBalance: 850000000,
      portfolio: [
        { assetId: 'GOLD', shares: 5, avgPrice: 1180.00 },
        { assetId: 'FOOLAD', shares: 10000, avgPrice: 0.080 }
      ],
      purchaseLots: [
        { id: 'LOT-101', assetId: 'GOLD', shares: 5, buyPrice: 1180.00, date: new Date().toISOString() },
        { id: 'LOT-102', assetId: 'FOOLAD', shares: 10000, buyPrice: 0.080, date: new Date().toISOString() }
      ],
      orders: [],
      alerts: [],
      activities: [
        { id: 'ACT-101', type: 'system', titleEn: 'Account created', titleFa: 'حساب کاربری ایجاد شد', timestamp: new Date().toISOString() }
      ]
    }
  };

  // Helper: Get or create session user
  const getUser = (email: string = 'demo@assetchain.io') => {
    if (!dbUsers[email]) {
      dbUsers[email] = {
        email,
        name: email.split('@')[0],
        usdtBalance: 10000,
        tomanBalance: 600000000,
        portfolio: [],
        purchaseLots: [],
        orders: [],
        alerts: [],
        activities: [
          { id: `ACT-${Date.now()}`, type: 'system', titleEn: 'Account initialized', titleFa: 'حساب کاربری فعال شد', timestamp: new Date().toISOString() }
        ]
      };
    }
    return dbUsers[email];
  };

  // --- API ROUTES ---

  // 1. Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", appName: "AssetChain API Backend", timestamp: new Date().toISOString() });
  });

  // 2. Get all assets
  app.get("/api/assets", (req, res) => {
    const { category } = req.query;
    if (category && category !== 'all') {
      const filtered = dbAssets.filter(a => a.category === category);
      return res.json({ success: true, count: filtered.length, assets: filtered });
    }
    res.json({ success: true, count: dbAssets.length, assets: dbAssets });
  });

  // 3. Get single asset details
  app.get("/api/assets/:id", (req, res) => {
    const asset = dbAssets.find(a => a.id.toUpperCase() === req.params.id.toUpperCase());
    if (!asset) {
      return res.status(404).json({ success: false, error: "Asset not found" });
    }
    res.json({ success: true, asset });
  });

  // 4. User Auth API
  app.post("/api/auth/register", (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password required" });
    }
    const user = getUser(email);
    if (name) user.name = name;
    res.json({
      success: true,
      message: "Registration successful",
      token: `token_${Buffer.from(email).toString('base64')}`,
      user: { email: user.email, name: user.name, usdtBalance: user.usdtBalance, tomanBalance: user.tomanBalance }
    });
  });

  app.post("/api/auth/login", (req, res) => {
    const { email } = req.body;
    const targetEmail = email || 'demo@assetchain.io';
    const user = getUser(targetEmail);
    res.json({
      success: true,
      message: "Login successful",
      token: `token_${Buffer.from(targetEmail).toString('base64')}`,
      user: { email: user.email, name: user.name, usdtBalance: user.usdtBalance, tomanBalance: user.tomanBalance }
    });
  });

  // 5. User Profile & Wallet Balance
  app.get("/api/user/profile", (req, res) => {
    const email = req.headers['x-user-email'] as string || 'demo@assetchain.io';
    const user = getUser(email);
    res.json({ success: true, user });
  });

  app.post("/api/user/deposit", (req, res) => {
    const email = req.headers['x-user-email'] as string || 'demo@assetchain.io';
    const { amount, currency = 'USDT' } = req.body;
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ success: false, error: "Invalid deposit amount" });
    }

    const user = getUser(email);
    if (currency === 'IRT' || currency === 'Toman') {
      user.tomanBalance += numAmount;
    } else {
      user.usdtBalance += numAmount;
    }

    user.activities.unshift({
      id: `ACT-${Date.now()}`,
      type: 'deposit',
      titleEn: `Deposited ${numAmount} ${currency}`,
      titleFa: `واریز ${numAmount} ${currency}`,
      timestamp: new Date().toISOString()
    });

    res.json({ success: true, message: "Deposit successful", usdtBalance: user.usdtBalance, tomanBalance: user.tomanBalance });
  });

  // 6. Execute Buy Order
  app.post("/api/trades/buy", (req, res) => {
    const email = req.headers['x-user-email'] as string || 'demo@assetchain.io';
    const { assetId, shares } = req.body;
    const sharesNum = Number(shares);

    if (!assetId || isNaN(sharesNum) || sharesNum <= 0) {
      return res.status(400).json({ success: false, error: "Invalid asset ID or share amount" });
    }

    const asset = dbAssets.find(a => a.id.toUpperCase() === assetId.toUpperCase());
    if (!asset) {
      return res.status(404).json({ success: false, error: "Asset not found" });
    }

    const totalCost = sharesNum * asset.price;
    const user = getUser(email);

    if (user.usdtBalance < totalCost) {
      return res.status(400).json({ success: false, error: "Insufficient USDT balance" });
    }

    // Deduct USDT balance
    user.usdtBalance -= totalCost;

    // Update portfolio holdings
    const existing = user.portfolio.find(p => p.assetId === asset.id);
    if (existing) {
      const totalShares = existing.shares + sharesNum;
      const totalInvested = (existing.shares * existing.avgPrice) + totalCost;
      existing.avgPrice = totalInvested / totalShares;
      existing.shares = totalShares;
    } else {
      user.portfolio.push({ assetId: asset.id, shares: sharesNum, avgPrice: asset.price });
    }

    // Add purchase lot
    user.purchaseLots.push({
      id: `LOT-${Date.now()}`,
      assetId: asset.id,
      shares: sharesNum,
      buyPrice: asset.price,
      date: new Date().toISOString()
    });

    // Record activity
    user.activities.unshift({
      id: `ACT-${Date.now()}`,
      type: 'trade',
      titleEn: `Bought ${sharesNum} shares of #${asset.id} at ${asset.price} USDT`,
      titleFa: `خرید ${sharesNum} سهم از #${asset.id} با قیمت ${asset.price} تتر`,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: `Successfully bought ${sharesNum} shares of ${asset.enName}`,
      usdtBalance: user.usdtBalance,
      portfolio: user.portfolio,
      purchaseLots: user.purchaseLots
    });
  });

  // 7. Execute Sell Order
  app.post("/api/trades/sell", (req, res) => {
    const email = req.headers['x-user-email'] as string || 'demo@assetchain.io';
    const { assetId, shares } = req.body;
    const sharesNum = Number(shares);

    if (!assetId || isNaN(sharesNum) || sharesNum <= 0) {
      return res.status(400).json({ success: false, error: "Invalid asset ID or share amount" });
    }

    const asset = dbAssets.find(a => a.id.toUpperCase() === assetId.toUpperCase());
    if (!asset) {
      return res.status(404).json({ success: false, error: "Asset not found" });
    }

    const user = getUser(email);
    const existing = user.portfolio.find(p => p.assetId === asset.id);

    if (!existing || existing.shares < sharesNum) {
      return res.status(400).json({ success: false, error: "Insufficient asset shares to sell" });
    }

    const totalRevenue = sharesNum * asset.price;
    existing.shares -= sharesNum;
    if (existing.shares <= 0) {
      user.portfolio = user.portfolio.filter(p => p.assetId !== asset.id);
    }

    // Add revenue to USDT balance
    user.usdtBalance += totalRevenue;

    // Record activity
    user.activities.unshift({
      id: `ACT-${Date.now()}`,
      type: 'trade',
      titleEn: `Sold ${sharesNum} shares of #${asset.id} at ${asset.price} USDT`,
      titleFa: `فروش ${sharesNum} سهم از #${asset.id} با قیمت ${asset.price} تتر`,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: `Successfully sold ${sharesNum} shares of ${asset.enName}`,
      usdtBalance: user.usdtBalance,
      portfolio: user.portfolio
    });
  });

  // 8. User Activity Logs
  app.get("/api/activity", (req, res) => {
    const email = req.headers['x-user-email'] as string || 'demo@assetchain.io';
    const user = getUser(email);
    res.json({ success: true, count: user.activities.length, activities: user.activities });
  });

  // --- VITE MIDDLEWARE / STATIC SERVING ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 AssetChain Backend Server running on http://localhost:${PORT}`);
  });
}

startServer();
