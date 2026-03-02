import express from 'express';
import path from 'path';
import { config } from '../config/env.config';
import oracledb from 'oracledb';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API: health check (including DB status)
app.get('/api/health', async (_req, res) => {
    let dbStatus = 'disconnected';
    try {
        if (config.db.user && config.db.password) {
            const conn = await oracledb.getConnection({
                user: config.db.user,
                password: config.db.password,
                connectionString: config.db.connectionString,
            });
            await conn.close();
            dbStatus = 'connected';
        }
    } catch {
        dbStatus = 'disconnected';
    }

    res.json({
        status: 'ok',
        env: config.env,
        db: dbStatus,
        timestamp: new Date().toISOString(),
    });
});

// API: search (simple echo for testing)
app.get('/search', (req, res) => {
    const query = req.query.search || '';
    res.json({ query, results: [] });
});

// About page
app.get('/about', (_req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8"><title>About - Webapp App Simple</title></head>
    <body>
        <header><nav><a href="/">Home</a><a href="/about">About</a><a href="/status">Status</a></nav></header>
        <main><h1>About</h1><p>Webapp App Simple — testing framework demo.</p></main>
    </body>
    </html>
    `);
});

// Status page
app.get('/status', (_req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8"><title>Status - Webapp App Simple</title></head>
    <body>
        <header><nav><a href="/">Home</a><a href="/about">About</a><a href="/status">Status</a></nav></header>
        <main><h1>System Status</h1><p>All systems operational.</p></main>
    </body>
    </html>
    `);
});

// Fallback: serve index.html for SPA-like behavior
app.get('/{*path}', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] 🚀 Running at http://0.0.0.0:${PORT}`);
    console.log(`[Server] Environment: ${config.env}`);
});

export default app;
