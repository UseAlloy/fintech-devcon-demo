import { WrappedEncryptionKeys } from '../collections/wrapped-encryption-keys';
import { WrappedEncryptionKey, WrappedEncryptionKeyRecord } from '../types/wrapped-encryption-keys';

interface CreateWrappedEncryptionKeyOptions {
  title: WrappedEncryptionKey['title'];
  wrappedKey: WrappedEncryptionKey['wrapped_key'];
  wrappedKeyId: WrappedEncryptionKey['wrapped_key_id'];
}

const toObject = (record: any) => {
  return {
    _id: String(record._id),
    title: record.title,
    wrapped_key: record.wrapped_key,
    wrapped_key_id: record.wrapped_key_id
  } as WrappedEncryptionKeyRecord;
}

export const findWrappedEncryptionKeyByTitleAndKeyId = async (title: string, wrappedKeyId) => {
  const records = await WrappedEncryptionKeys
    .find({ title, wrapped_key_id: wrappedKeyId })
    .limit(1)
    .exec();

  if (!records.length) {
    return undefined;
  }

  return toObject(records[0]);
}

export const createWrappedEncryptionKey = async (data: CreateWrappedEncryptionKeyOptions) => {
  const entity = new WrappedEncryptionKeys({
    title: data.title,
    wrapped_key: data.wrappedKey,
    wrapped_key_id: data.wrappedKeyId
  });

  const record = await entity.save();
  return toObject(record);
}

export const encryptionKeyFindByTitleAndKeyId = async (title: string, wrappedKeyId: string) => {
  return findWrappedEncryptionKeyByTitleAndKeyId(title, wrappedKeyId);
}

export const encryptionKeyStore = async (title: string, wrappedKeyId: string, wrappedKey: string) => {
  await createWrappedEncryptionKey({
    title,
    wrappedKey,
    wrappedKeyId
  });
}
