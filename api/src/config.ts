import { v4 as uuidv4 } from 'uuid';

import { ConfigLoader } from './lib/config-loader';
import { Logger } from './lib/logger';

interface Config {
  DEMO_ENVIRONMENT: string;
  APP_TOKEN: string;
  MONGO_URI: string;
  MONGO_USER: string;
  MONGO_PASSWORD: string;
  SERVER_UID: string;
}

const serverUid = uuidv4();

export const baseConfig: Config = {
  DEMO_ENVIRONMENT: process.env.THE_DEMO_ENVIRONMENT,
  APP_TOKEN: 'defaulttoken',
  MONGO_URI: 'mongodb://mongo:mongo@mongo:27017',
  MONGO_USER: 'mongo',
  MONGO_PASSWORD: 'mongo',
  SERVER_UID: serverUid,
};

export const loadConfig = (logger: Logger): Promise<Config> => {
  const configLoader = new ConfigLoader<Config>(logger);
  return configLoader.load(baseConfig);
};
