import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Only import Vite in dev (important for production builds)
let createViteServer: any;
if (process.env.NODE_ENV === "development") {
  const vite = await import("vite");
  createViteServer = vite.createServer;
}

const app = express();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Use dynamic port (REQUIRED for Docker/ECS)
const PORT = process.env.PORT || 5000;

app.use(express.json());

/**
 * ✅ Health check (VERY IMPORTANT for ECS + Load Balancer)
 */
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

/**
 * 🚀 DEVELOPMENT MODE (Vite middleware)
 */
if (process.env.NODE_ENV === "development") {
  (async () => {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    app.use(vite.middlewares);
  })();
}

/**
 * 🚀 PRODUCTION MODE (Serve built React app)
 */
else {
  const distPath = path.join(process.cwd(), "dist");

  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

/**
 * 🚀 Start Server
 */
app.listen(parseInt(process.env.PORT || '5000', 10), "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
