const http = require('http');
const mineflayer = require('mineflayer');

// --- ১. HTTP Web Server (Render & Cron-job.org Monitoring) ---
const PORT = process.env.PORT || 10000;

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'OK', 
      message: 'SR Dual AFK Bots Active!', 
      uptime: Math.floor(process.uptime()) + ' seconds' 
    }));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[HTTP Server] Dual bot monitor running on port ${PORT}`);
});


// ==========================================
// --- ২. JAVA SERVER BOT (Server 1) ---
// ==========================================
const JAVA_HOST = 'SRSHOHAG27-duKW.aternos.me';
const JAVA_PORT = 28337;

function createJavaBot() {
  console.log('[Java Bot] Connecting to Java server...');

  const bot = mineflayer.createBot({
    host: JAVA_HOST,
    port: JAVA_PORT,
    username: 'MOD_1_BY_SR',
    version: false,
  });

  bot.on('spawn', () => {
    console.log('>>> [SUCCESS] Java AFK Bot joined Server 1! <<<');

    setInterval(() => {
      if (bot && bot.entity) {
        bot.swingArm('right');
      }
    }, 20000);
  });

  bot.on('end', (reason) => {
    console.log(`[Java Bot] Disconnected: ${reason}. Reconnecting in 15s...`);
    setTimeout(createJavaBot, 15000);
  });

  bot.on('error', (err) => {
    console.log('[Java Bot Error]', err.message);
  });
}


// ==========================================
// --- ৩. SECOND BOT (Server 2) ---
// ==========================================
const SERVER2_HOST = 'SRSHOHAG27.aternos.me';
const SERVER2_PORT = 19132;

function createSecondBot() {
  console.log('[Bot 2] Connecting to Server 2...');

  const bot = mineflayer.createBot({
    host: SERVER2_HOST,
    port: SERVER2_PORT,
    username: 'BEDROCK_AFK_SR',
    version: false,
  });

  bot.on('spawn', () => {
    console.log('>>> [SUCCESS] AFK Bot 2 joined Server 2! <<<');

    setInterval(() => {
      if (bot && bot.entity) {
        bot.swingArm('right');
      }
    }, 20000);
  });

  bot.on('end', (reason) => {
    console.log(`[Bot 2] Disconnected: ${reason}. Reconnecting in 15s...`);
    setTimeout(createSecondBot, 15000);
  });

  bot.on('error', (err) => {
    console.log('[Bot 2 Error]', err.message);
  });
}


// ==========================================
// --- ৪. SYSTEM HANDLERS & START ---
// ==========================================
process.on('uncaughtException', (err) => {
  console.error('[System Alert] Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('[System Alert] Unhandled Rejection:', reason);
});

// Start Both Bots
createJavaBot();
createSecondBot();
