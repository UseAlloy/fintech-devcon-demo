import path from 'path';

import mongoose from 'mongoose';
import requireDir from 'require-dir';

interface MongoConfig {
  MONGO_URI: string;
  MONGO_USER?: string;
  MONGO_PASSWORD?: string;
}

class Mongo {
  private connection: typeof mongoose | null = null;

  constructor(private config: MongoConfig) {}

  private initCollections(collectionsDirectory: string) {
    requireDir(collectionsDirectory);
  }

  private getConnectionOptions() {
    const options: mongoose.ConnectOptions = {};

    if (this.config.MONGO_USER && this.config.MONGO_PASSWORD) {
      options.user = this.config.MONGO_USER;
      options.pass = this.config.MONGO_PASSWORD;
      options.authSource = 'admin';
    }

    return options;
  }

  async connect(collectionsDirectory: string) {
    const connectOptions = this.getConnectionOptions();

    this.connection = await mongoose.connect(
      this.config.MONGO_URI,
      connectOptions
    );

    this.initCollections(collectionsDirectory);
  }

  async disconnect() {
    if (this.connection && this.connection.connection.readyState === 1) {
      await this.connection.disconnect();
    }
  }
}

export const createMongoConnection = async (config: MongoConfig): Promise<Mongo> => {
  const collectionsDirectory = path.resolve(__dirname, '../collections');
  const client = new Mongo(config);

  await client.connect(collectionsDirectory);
  return client;
};
