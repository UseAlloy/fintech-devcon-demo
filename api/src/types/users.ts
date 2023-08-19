export type User = {
  date_of_birth: string;
  date_of_birth_encrypted: string;
  date_of_birth_hashed: string;
  email_address: string;
  email_address_encrypted: string;
  email_address_hashed: string;
  name_first: string;
  name_first_encrypted: string;
  name_first_hashed: string;
  name_last: string;
  name_last_encrypted: string;
  name_last_hashed: string;
  phone_number: string;
  phone_number_encrypted: string;
  phone_number_hashed: string;
  social_security_number: string;
  social_security_number_encrypted: string;
  social_security_number_hashed: string;
  user_token: string;
  created_at: Date;
};

export type UserRecord = User & {
  _id: string;
}

export type EncryptedUser = Pick<
  User,
  'date_of_birth_encrypted'
  | 'email_address_encrypted'
  | 'name_first_encrypted'
  | 'name_last_encrypted'
  | 'phone_number_encrypted'
  | 'social_security_number_encrypted'
  | 'user_token'
  | 'created_at'
>

export type DecryptedUser = Pick<
  UserRecord,
  'date_of_birth'
  | 'email_address'
  | 'name_first'
  | 'name_last'
  | 'phone_number'
  | 'social_security_number'
  | 'user_token'
  | 'created_at'
>

export type UserSearchFilters = {
  date_of_birth?: string[];
  email_address?: string[];
  name_first?: string[];
  name_last?: string[];
  phone_number?: string[];
  social_security_number?: string[];
  user_token?: string[];
}
