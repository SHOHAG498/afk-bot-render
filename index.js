const http = require('http');
const mineflayer = require('mineflayer');

// --- বটের রিয়েল-টাইম স্ট্যাটাস ট্র্যাক করার ভেরিয়েবল ---
let botStatus = "Disconnected (Connecting...)";
let lastJoinTime = "Never";
let botInstance = null;

// --- ১. HTTP Web Server (Render & Cron-job.org Monitoring - 1m Ping) ---
const PORT = process.env.PORT || 10000;

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'OK', 
      bot_connection: botStatus,
      last_joined: lastJoinTime,
      message: 'Render SR AFK Bot Active!', 
      uptime: Math.floor(process.uptime()) + ' seconds' 
    }));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[HTTP Server] Bot web monitor running on port ${PORT}`);
});

// --- ২. Minecraft Bot Config & Logic ---
const SERVER_HOST = 'SRSHOHAG27-duKW.aternos.me'; // আপনার আসল এটারনস অ্যাড্রেস
const SERVER_PORT = 28337;
const BOT_USERNAME = 'SR_AFK_Bot_1';

function createBot() {
  if (botInstance) {
    try {
      botInstance.quit();
    } catch (e) {}
    botInstance = null;
  }

  console.log(`[Bot] Connecting to Minecraft server as ${BOT_USERNAME}...`);
  botStatus = `Connecting to Server as ${BOT_USERNAME}...`;

  const bot = mineflayer.createBot({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: BOT_USERNAME,
    hideErrors: false,
    checkTimeoutInterval: 60000
  });

  botInstance = bot;

  bot.on('spawn', () => {
    console.log(`>>> [SUCCESS] ${BOT_USERNAME} joined the server! <<<`);
    botStatus = `ONLINE (Successfully Joined as ${BOT_USERNAME})`;
    lastJoinTime = new Date().toLocaleTimeString();

    // Anti-AFK Swing Arm (প্রতি ২০ সেকেন্ড পর পর হাত নাড়াবে)
    setInterval(() => {
      if (bot && bot.entity) {
        bot.swingArm('right');
      }
    }, 20000);
  });

  bot.on('end', (reason) => {
    console.log(`[Bot Disconnected] Reason: ${reason}. Reconnecting in 25s...`);
    botStatus = `Disconnected (${reason}). Reconnecting in 25s...`;
    setTimeout(createBot, 25000);
  });

  bot.on('error', (err) => {
    console.log('[Bot Error]', err.message);
    botStatus = `Error: ${err.message}`;
  });
}

// Global System Handlers
process.on('uncaughtException', (err) => {
  console.error('[System Alert] Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('[System Alert] Unhandled Rejection:', reason);
});

// Start Bot
createBot();
