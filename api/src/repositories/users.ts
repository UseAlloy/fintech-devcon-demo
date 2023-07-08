import { Users } from '../collections/users';
import { NewUserPayload, UserRecordCleaned } from '../types/users';

const toObject = (record: any) => {
  return {
    name_first: record.name_first,
    name_last: record.name_last,
    email_address: record.email_address,
    user_token: record.user_token,
    created_at: record.created_at
  } as UserRecordCleaned;
};

export const findUsers = async () => {
  const columns = [
    '-_id',
    'name_first',
    'name_last',
    'email_address',
    'user_token',
    'created_at'
  ].join(' ');

  const records = await Users
    .find()
    .select(columns);

  return records;
};

export const saveNewUser = async (payload: NewUserPayload) => {
  const entity = new Users({
    name_first: payload.name_first,
    name_last: payload.name_last,
    email_address: payload.email_address,
    salt: payload.salt,
    hash: payload.hash,
    user_token: payload.user_token,
    created_at: payload.created_at
  });

  const record = await entity.save();
  return toObject(record);
};
