import { Users } from '../collections/users';
import { formatDate } from '../lib/helpers';
import { NewUserPayload, UserRecordCleaned, UserSearchFilters } from '../types/users';

const CLEANED_COLUMNS = [
  '-_id',
  'date_of_birth',
  'email_address',
  'name_first',
  'name_last',
  'phone_number',
  'social_security_number',
  'user_token',
  'created_at'
].join(' ');

const toObject = (record: any) => {
  return {
    date_of_birth: formatDate(record.date_of_birth),
    email_address: record.email_address,
    name_first: record.name_first,
    name_last: record.name_last,
    phone_number: record.phone_number,
    social_security_number: record.social_security_number,
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

  const users = await Users
    .find(options)
    .select(CLEANED_COLUMNS);

  return users.map(toObject);
};

export const findUser = async (userToken: string) => {
  const user = await Users
    .findOne({ user_token: userToken })
    .select(CLEANED_COLUMNS);

  return toObject(user);
};

export const saveNewUser = async (payload: NewUserPayload) => {
  const entity = new Users({
    date_of_birth: payload.date_of_birth,
    email_address: payload.email_address,
    name_first: payload.name_first,
    name_last: payload.name_last,
    phone_number: payload.phone_number,
    social_security_number: payload.social_security_number,
    user_token: payload.user_token,
    created_at: payload.created_at
  });

  const record = await entity.save();
  return toObject(record);
};
