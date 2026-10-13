const http = require('http');
const mineflayer = require('mineflayer');
const bedrock = require('bedrock-protocol');

// --- ১. HTTP Web Server (Render & Cron-job.org Monitoring) ---
const PORT = process.env.PORT || 10000;

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'OK', 
      message: 'SR Dual AFK Bots (Java + Bedrock) Active!', 
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
// --- ২. JAVA SERVER BOT CONFIG & LOGIC ---
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
    console.log('>>> [SUCCESS] Java AFK Bot joined the server! <<<');

    // Anti-AFK Swing Arm
    setInterval(() => {
      if (bot && bot.entity) {
        bot.swingArm('right');
      }
    }, 20000);
  });

  bot.on('end', (reason) => {
    console.log(`[Java Bot Disconnected] Reason: ${reason}. Reconnecting in 15s...`);
    setTimeout(createJavaBot, 15000);
  });

  bot.on('error', (err) => {
    console.log('[Java Bot Error]', err.message);
  });
}


// =============================================
// --- ৩. BEDROCK SERVER BOT CONFIG & LOGIC ---
// =============================================
const BEDROCK_HOST = 'SRSHOHAG27.aternos.me'; 
const BEDROCK_PORT = 19132;

function createBedrockBot() {
  console.log('[Bedrock Bot] Connecting to Bedrock server...');

  const client = bedrock.createClient({
    host: BEDROCK_HOST,
    port: BEDROCK_PORT,
    username: 'BEDROCK_AFK_SR',
    offline: true
  });

  client.on('join', () => {
    console.log('>>> [SUCCESS] Bedrock AFK Bot joined the server! <<<');
  });

  client.on('close', () => {
    console.log('[Bedrock Bot Disconnected] Reconnecting in 15s...');
    setTimeout(createBedrockBot, 15000);
  });

  client.on('error', (err) => {
    console.log('[Bedrock Bot Error]', err.message);
  });
}


// ==========================================
// --- ৪. GLOBAL SYSTEM HANDLERS & START ---
// ==========================================
process.on('uncaughtException', (err) => {
  console.error('[System Alert] Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('[System Alert] Unhandled Rejection:', reason);
});

// Start Both Bots
createJavaBot();
createBedrockBot();
