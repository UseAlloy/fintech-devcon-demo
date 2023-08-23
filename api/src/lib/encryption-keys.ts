// https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#data-keys
import { KMS } from './kms';
import { EncryptionKeys } from '../types/encryption-keys';
import { WrappedEncryptionKey } from '../types/wrapped-encryption-keys';

type StoreWrappedKeyOptions = (title: string, wrappedKeyId: string, wrappedKey: string) => Promise<void>;
type FetchWrappedKeyOptions = (title: string, wrappedKeyId: string) => Promise<WrappedEncryptionKey | undefined>

export class EncryptionKeysService {
  private kms: KMS;

  constructor(
    private fetchWrappedKey: FetchWrappedKeyOptions,
    private storeWrappedKey: StoreWrappedKeyOptions
  ) {
    this.kms = new KMS();
  }

  private async createWrappedKey(title: string, wrappedKeyId: string) {
    const wrappedEncryptionKey = await this.kms.generateDataKey(wrappedKeyId);
    return this.storeWrappedKey(
      title,
      wrappedKeyId,
      wrappedEncryptionKey.toString('base64')
    );
  }

  private async getUnwrappedKey(title: string, wrappedKeyId: string) {
    const encryptionKeyData = await this.fetchWrappedKey(title, wrappedKeyId);
    if (!encryptionKeyData) {
      return undefined;
    }

    return this.kms.decryptDataKey(
      encryptionKeyData.wrapped_key_id,
      Buffer.from(encryptionKeyData.wrapped_key, 'base64'),
    );
  }

  async getOrCreateUnwrappedKey(title: string, wrappedKeyId: string) {
    const encryptionKey = await this.getUnwrappedKey(title, wrappedKeyId);
    if (encryptionKey) {
      return encryptionKey;
    }

    await this.createWrappedKey(title, wrappedKeyId);
    const newEncryptionKey = await this.getUnwrappedKey(title, wrappedKeyId);
    return newEncryptionKey;
  }
}

export const fetchEncryptionKeys = async (
  fetchWrappedKey: FetchWrappedKeyOptions,
  storeWrappedKey: StoreWrappedKeyOptions,
  kmsMasterKey: string,
  skipAwsKms: boolean
): Promise<EncryptionKeys> => {
  if (skipAwsKms) {
    return {
      piiEncryptionKey: Buffer.from('pii_encryption_key______________'),
      piiHashSalt: Buffer.from('pii_hash_salt___________________'),
    };
  }

  const service = new EncryptionKeysService(fetchWrappedKey, storeWrappedKey);
  const [piiEncryptionKey, piiHashSalt] = await Promise.all([
    service.getOrCreateUnwrappedKey('pii_encryption_key', kmsMasterKey),
    service.getOrCreateUnwrappedKey('pii_hash_key', kmsMasterKey),
  ]);

  return {
    piiEncryptionKey,
    piiHashSalt
  };
}
