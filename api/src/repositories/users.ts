import { Users } from '../collections/users';
import { User, EncryptedUser, UserPIISearchFilters } from '../types/users';

const PII_READ_COLUMNS = [
  'date_of_birth_encrypted',
  'email_address_encrypted',
  'name_first_encrypted',
  'name_last_encrypted',
  'phone_number_encrypted',
  'social_security_number_encrypted',
  'user_token',
  'created_at'
];

const toObject = (record: any) => {
  return {
    date_of_birth_encrypted: record.date_of_birth_encrypted,
    email_address_encrypted: record.email_address_encrypted,
    name_first_encrypted: record.name_first_encrypted,
    name_last_encrypted: record.name_last_encrypted,
    phone_number_encrypted: record.phone_number_encrypted,
    social_security_number_encrypted: record.social_security_number_encrypted,
    user_token: record.user_token,
    created_at: record.created_at
  } as EncryptedUser;
};

export const findUsers = async (filters: UserPIISearchFilters = {}) => {
  const users = await Users
    .find(filters)
    .select(PII_READ_COLUMNS);

  return users.map(toObject);
};

export const findUser = async (userToken: string) => {
  const user = await Users
    .findOne({ user_token: userToken })
    .select(PII_READ_COLUMNS);

  return toObject(user);
};

export const saveNewUser = async (payload: User) => {
  const entity = new Users(payload);
  const record = await entity.save();
  return toObject(record);
};
