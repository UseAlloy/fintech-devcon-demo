import hapi from '@hapi/hapi';
import * as inert from '@hapi/inert';
import * as hapiSwagger from 'hapi-swagger';
import * as vision from '@hapi/vision';

import { Logger } from './lib/logger';
import routes from './routes';
import pkg from '../package.json';

export class App {
  constructor(
    private logger: Logger,
  ) {}

  async startServer() {
    const server = new hapi.Server({
      host: '0.0.0.0',
      port: process.env.PORT || 8000
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

    server.ext('onRequest', (request: any, reply) => {
      request.logger = this.logger;
      return reply.continue;
    });

    server.route(routes);

    await server.start();

    this.logger.info(`Server running on ${server.info.uri}`);
  }
}
