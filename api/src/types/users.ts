export type NewUserPayload = {
  date_of_birth: string;
  email_address: string;
  name_first: string;
  name_last: string;
  phone_number: string;
  social_security_number: string;
  user_token: string;
  created_at: Date;
};

export type UserRecordCleaned = {
  date_of_birth: string;
  email_address: string;
  name_first: string;
  name_last: string;
  phone_number: string;
  social_security_number: string;
  user_token: string;
  created_at: Date;
}

export type UserRecord = {
  _id: string;
  date_of_birth: string;
  email_address: string;
  name_first: string;
  name_last: string;
  phone_number: string;
  social_security_number: string;
  user_token: string;
  created_at: Date;
}

export type UserSearchFilters = {
  date_of_birth?: string[];
  email_address?: string[];
  name_first?: string[];
  name_last?: string[];
  phone_number?: string[];
  social_security_number?: string[];
  user_token?: string[];
};
