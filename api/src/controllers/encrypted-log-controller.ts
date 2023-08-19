import { decrypt } from '../lib/encryption';
import { Request } from '../types/router';

type DecryptLogsPayload = {
  encrypted_text: string;
}

export const decryptLogs = async (request: Request, reply) => {
  const { encryptionKeys, logger } = request;
  const {
    encrypted_text: encryptedLog
  } = request.payload as DecryptLogsPayload;

  try {
    const decryptedText = JSON.parse(
      decrypt(encryptedLog, encryptionKeys.appLogs)
    );

    return reply.response(decryptedText).code(200);
  } catch (err) {
    logger.error({
      stack: err.stack,
      message: err.message
    }, 'Failed to decrypt logs');

    return reply.response({
      errors: [{
        status: 500,
        detail: 'Failed to decrypt logs'
      }]
    }).code(500);
  }
}
