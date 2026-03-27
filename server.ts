import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock API for Stock Data (In production, replace with real API calls)
  app.get("/api/stocks/trending", (req, res) => {
    res.json([
      { symbol: "AAPL", name: "Apple Inc.", price: 185.92, change: 1.2, trend: "up" },
      { symbol: "TSLA", name: "Tesla, Inc.", price: 175.22, change: -2.4, trend: "down" },
      { symbol: "NVDA", name: "NVIDIA Corp.", price: 875.32, change: 5.8, trend: "up" },
      { symbol: "MSFT", name: "Microsoft Corp.", price: 415.50, change: 0.5, trend: "up" },
    ]);
  });

  // Mock Prediction Logic
  app.get("/api/stocks/:symbol/prediction", (req, res) => {
    const { symbol } = req.params;
    const basePrice = 200;
    const predicted = basePrice + (Math.random() * 20 - 10);
    res.json({
      symbol,
      currentPrice: basePrice,
      predictedPrice: predicted.toFixed(2),
      confidence: (Math.random() * 0.3 + 0.65).toFixed(2),
      recommendation: predicted > basePrice ? "BUY" : "HOLD"
    });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`StockSmart Server running on http://localhost:${PORT}`);
  });
}

startServer();
