import { ServerRoute } from '@hapi/hapi';
import joi from 'joi';

import * as controller from '../controllers/encrypted-log-controller'

const encryptedLogRoutes: ServerRoute[] = [
  {
    method: 'POST',
    path: '/decrypt-logs',
    handler: controller.decryptLogs,
    options: {
      tags: ['logs'],
      validate: {
        payload: joi.object({
          encrypted_text: joi.string().required(),
        }).required()
      }
    }
  }
];

export default encryptedLogRoutes;
