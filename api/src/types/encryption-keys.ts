type EncryptionKeyTitle =
  | 'piiEncryptionKey'
  | 'piiHashSalt'
  | 'appLogs';

export type EncryptionKeys = {
  [title in EncryptionKeyTitle]: Buffer
};
