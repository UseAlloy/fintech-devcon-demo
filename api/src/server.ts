import { baseConfig, loadConfig } from './config';
import { App } from './app';
import { Logger, LogLevel } from './lib/logger';
import { createMongoConnection } from './lib/mongo';
import { fetchEncryptionKeys } from './lib/encryption-keys';
import { encryptionKeyFindByTitleAndKeyId, encryptionKeyStore } from './repositories/wrapped-encryption-keys';

import pkg from '../package.json';

export const runner = async (
  skipAwsSecrets: boolean = false,
  skipAwsKms: boolean = false,
  logLevel: LogLevel = 'info'
) => {
  const logger = new Logger({
    name: `${pkg.name}-${baseConfig.SERVER_UID}`,
    stream: process.stdout,
    level: logLevel
  });

  logger.info('Initializing...');

  try {
    // setup configuration
    const config = await loadConfig(logger, skipAwsSecrets);

    // setup mongo
    await createMongoConnection(config);
    logger.info('Connected to database');

    // setup encryption keys
    const encryptionKeys = await fetchEncryptionKeys(
      encryptionKeyFindByTitleAndKeyId,
      encryptionKeyStore,
      config.API_KMS_KEY_ID,
      skipAwsKms
    );

    const hapiApp = new App(logger, encryptionKeys);

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
