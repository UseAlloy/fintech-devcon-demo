import mongoose, { Schema } from 'mongoose';

import { WrappedEncryptionKey } from '../types/wrapped-encryption-keys';

const WrappedEncryptionKeysCollection = new Schema<WrappedEncryptionKey>({
  title: {
    type: Schema.Types.String,
    required: true
  },
  wrapped_key: {
    type: Schema.Types.String,
    required: true
  },
  wrapped_key_id: {
    type: Schema.Types.String,
    required: true
  }
});

WrappedEncryptionKeysCollection.index(
  { title: 1, wrapped_key_id: 1 },
  { unique: true }
);

export const WrappedEncryptionKeys = mongoose.model<WrappedEncryptionKey>(
  'wrapped-encryption-keys',
  WrappedEncryptionKeysCollection
);
