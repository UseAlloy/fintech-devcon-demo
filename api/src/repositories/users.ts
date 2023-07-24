import { Users } from '../collections/users';
import { NewUserPayload, UserRecordCleaned, UserSearchFilters } from '../types/users';

const CLEANED_COLUMNS = [
  '-_id',
  'name_first',
  'name_last',
  'email_address',
  'user_token',
  'created_at'
].join(' ');

const toObject = (record: any) => {
  return {
    name_first: record.name_first,
    name_last: record.name_last,
    email_address: record.email_address,
    user_token: record.user_token,
    created_at: record.created_at
  } as UserRecordCleaned;
};

const formatSearchOptions = (filters: UserSearchFilters) => Object.keys(filters)
  .reduce((acc, filter) => {
    const entries = filters[filter];

    if (entries.length > 0) {
      acc[filter] = { $regex: `.*${entries[0]}*.`, $options: 'i' };
    }

    return acc;
  }, {});

export const findUsers = async (filters: UserSearchFilters = {}) => {
  const options = formatSearchOptions(filters);

  return Users
    .find(options)
    .select(CLEANED_COLUMNS);
};

export const findUser = async (userToken: string) => Users
  .findOne({ userToken })
  .select(CLEANED_COLUMNS);

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
