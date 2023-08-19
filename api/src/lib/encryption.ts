// https://codeforgeek.com/nodejs-crypto-module
import crypto from 'crypto';

const BYTES_LENGTH = 16;

export const encrypt = async (data: string, encryptionKey: Buffer) => {
  // NOTE: Why async vs sync https://github.com/nodejs/help/issues/457
  const bytes = await Promise.resolve(crypto.randomBytes(BYTES_LENGTH));
  const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, bytes);
  const updatedEncrypted = cipher.update(data);
  const final = Buffer.concat([updatedEncrypted, cipher.final()]);

  return `${bytes.toString('hex')}:${final.toString('hex')}`;
};

export const decrypt = (data: string, encryptionKey: Buffer) => {
  const [bytesBuffer, encryptedBuffer] = data.split(':');
  const bytes = Buffer.from(bytesBuffer, 'hex');
  const encryptedData = Buffer.from(encryptedBuffer, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, bytes);
  const updatedDecipher = decipher.update(encryptedData);
  const decrypted = Buffer.concat([updatedDecipher, decipher.final()]);

  return decrypted.toString();
};

export const hash = (data: string, hashSalt: Buffer) => {
  const hashed = crypto.createHash('sha256')
    .update(data, 'utf8')
    .update(hashSalt)
    .digest('hex');

  return hashed;
};
