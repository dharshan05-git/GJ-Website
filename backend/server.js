import { createApp } from './src/app.js';
import { connectDB } from './src/config/db.js';
import { env } from './src/config/env.js';

const start = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error('❌ Could not connect to MongoDB:', error.message);
    console.error('   Check MONGO_URI in backend/.env — is mongod running, or is the Atlas IP allowed?');
    process.exit(1);
  }

  const app = createApp();
  const server = app.listen(env.port, () => {
    console.log(`\n💎 GEVARIYA JEWELS API running in ${env.nodeEnv} mode`);
    console.log(`   → http://localhost:${env.port}/api`);
    console.log(`   → allowed origins: ${env.clientUrls.join(', ')}`);
    console.log(`   → razorpay: ${env.razorpay.enabled ? 'enabled' : 'not configured (COD only)'}\n`);
  });

  const shutdown = (signal) => {
    console.log(`\n${signal} received, closing server…`);
    server.close(() => process.exit(0));
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  process.on('unhandledRejection', (reason) => {
    console.error('❌ Unhandled rejection:', reason);
    server.close(() => process.exit(1));
  });
};

start();
