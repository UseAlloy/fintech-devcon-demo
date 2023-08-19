import hapi from '@hapi/hapi';
import * as inert from '@hapi/inert';
import * as hapiSwagger from 'hapi-swagger';
import * as vision from '@hapi/vision';

import { encrypt } from './lib/encryption';
import { Logger } from './lib/logger';
import { EncryptionKeys } from './types/encryption-keys';
import { Request } from './types/router';
import routes from './routes';
import pkg from '../package.json';

export class App {
  constructor(
    private logger: Logger,
    private encryptionKeys: EncryptionKeys
  ) {}

  async startServer() {
    const server = new hapi.Server({
      host: '0.0.0.0',
      port: process.env.PORT || 8000,
      routes: { cors: true }
    });

    const swaggerOptions = {
      info: { title: pkg.name }
    };



    const plugins = [
      { plugin: inert },
      { plugin: vision },
      { plugin: hapiSwagger, options: swaggerOptions }
    ];

    await server.register(plugins);

    server.ext('onRequest', (request: Request, reply) => {
      request.encryptionKeys = this.encryptionKeys;

      request.logger = this.logger.child({
        method: request.method,
        url: request.path,
      });

      return reply.continue;
    });

    server.ext('onPreHandler', async (request: Request, reply) => {
      request.logger.info({
        request: {
          url: request.path,
          headers: await encrypt(JSON.stringify(request.headers), this.encryptionKeys.appLogs),
          body: request.payload
            ? await encrypt(JSON.stringify(request.payload), this.encryptionKeys.appLogs)
            : request.payload
        }
      }, 'Hapi API Request')

      return reply.continue;
    })

    server.ext('onPostResponse', async (request: Request, reply) => {
      request.logger.info({
        response: {
          // @ts-ignore
          headers: await encrypt(JSON.stringify(request.response.headers), this.encryptionKeys.appLogs),
          // @ts-ignore
          body: request.response.source
            ? await encrypt(JSON.stringify(request.response.source), this.encryptionKeys.appLogs)
            // @ts-ignore
            : request.response.source,
          // @ts-ignore
          status: request.response.statusCode,
        }
      }, 'Hapi API Response');

      return reply.continue;
    });

    server.route(routes);

    await server.start();

    this.logger.info(`Server running on ${server.info.uri}`);
  }
}
