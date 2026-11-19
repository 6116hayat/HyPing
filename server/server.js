import 'dotenv/config';
import http from 'http';
import express from 'express';
import cors from 'cors';

import { connectDB } from './config/db.js';
import { initSocket } from './socket/index.js';

const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

const app = express();

// --- Middleware ---
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

// --- Routes ---
app.get('/api/health', (req, res) => {
    res.json({
        ok: true,
        time: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// --- Error handler (must be last) ---
app.use((err, req, res, next) => {
    console.error('[error]', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
    });
});

// --- HTTP server + Socket.IO share one port ---
const httpServer = http.createServer(app);
initSocket(httpServer, CLIENT_ORIGIN);

// --- Boot ---
async function start() {
    try {
        await connectDB();
        httpServer.listen(PORT, () => {
            console.log(`[server] listening on http://localhost:${PORT}`);
            console.log(`[server] CORS origin: ${CLIENT_ORIGIN}`);
        });
    } catch (err) {
        console.error('[server] failed to start:', err.message);
        process.exit(1);
    }
}

start();