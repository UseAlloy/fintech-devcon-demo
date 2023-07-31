import { Request as HapiReqiest } from '@hapi/hapi';
import { Logger } from '../lib/logger';

export type Request = HapiReqiest & {
  logger: Logger;
};
