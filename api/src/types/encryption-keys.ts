type EncryptionKeyTitle =
  | 'piiEncryptionKey'
  | 'piiHashSalt';

export type EncryptionKeys = {
  [title in EncryptionKeyTitle]: Buffer
};
