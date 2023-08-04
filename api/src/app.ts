import hapi from '@hapi/hapi';
import * as inert from '@hapi/inert';
import * as hapiSwagger from 'hapi-swagger';
import * as vision from '@hapi/vision';

import { Logger } from './lib/logger';
import { Request } from './types/router';
import routes from './routes';
import pkg from '../package.json';

export class App {
  constructor(
    private logger: Logger,
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
      request.logger = this.logger.child({
        method: request.method,
        url: request.path,
      });

      request.logger.info({
        request: {
          body: request.payload,
          headers: request.headers,
          method: request.method,
          url: request.path,
        }
      }, 'Hapi API Request');

      return reply.continue;
    });

    server.ext('onPreHandler', (request: Request, reply) => {
      request.payload && request.logger.info({
        request: { body: request.payload }
      }, 'Hapi API Request Body')
      return reply.continue;
    })

    server.ext('onPostResponse', (request: Request, reply) => {
      request.logger.info({
        response: {
          // @ts-ignore 
          body: request.response.source,
          // @ts-ignore 
          headers: request.response.headers,
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
