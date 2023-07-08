import { baseConfig, loadConfig } from './config';
import { App } from './app';
import { Logger, LogLevel } from './lib/logger';
import { createMongoConnection } from './lib/mongo';
import pkg from '../package.json';

export const runner = async (logLevel: LogLevel = 'info') => {
  const logger = new Logger({
    name: `${pkg.name}-${baseConfig.SERVER_UID}`,
    stream: process.stdout,
    level: logLevel
  });

  logger.info('Initializing...');

  try {
    // setup configuration
    const config = await loadConfig(logger);

    // setup mongo
    await createMongoConnection(config);
    logger.info('Connected to database');

    const hapiApp = new App(logger);

    await hapiApp.startServer();
  } catch (err) {
    logger.error({
      stack: err.stack,
      message: err.message
    }, 'Failed to start server');

    process.exit(1);
  }
}

runner();
