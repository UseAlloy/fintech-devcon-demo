import { Request as HapiReqiest } from '@hapi/hapi';
import { Logger } from '../lib/logger';
import { EncryptionKeys } from './encryption-keys';

export type Request = HapiReqiest & {
  logger: Logger;
  encryptionKeys: EncryptionKeys;
};
