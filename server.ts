import express from "express";
import path from "path";

const app = express();

const PORT = Number(process.env.PORT) || 5000;

app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Serve static files
const distPath = path.resolve("dist");

app.use(express.static(distPath));

// React fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// START SERVER
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
