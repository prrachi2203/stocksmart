const express = require('express');
const path = require('path');
const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// Serve static files from Vite build output
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.get('/api/stocks', (req, res) => {
  res.status(200).json({
    stocks: [
      { symbol: 'AAPL', price: 150.25 },
      { symbol: 'GOOGL', price: 140.80 },
      { symbol: 'MSFT', price: 380.50 }
    ]
  });
});

// Serve index.html for all other routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Stock Market App listening on 0.0.0.0:${PORT}`);
});
