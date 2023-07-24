export type NewUserPayload = {
  email_address: string;
  name_first: string;
  name_last: string;
  hash: string;
  salt: string;
  user_token: string;
  created_at: Date;
};

export type UserRecordCleaned = {
  email_address: string;
  name_first: string;
  name_last: string;
  user_token: string;
  created_at: string;
}

export type UserRecord = {
  _id: string;
  email_address: string;
  name_first: string;
  name_last: string;
  hash: string;
  salt: string;
  user_token: string;
  created_at: Date;
}

export type UserSearchFilters = {
  name_first?: string[];
  name_last?: string[];
  email_address?: string[];
  user_token?: string[];
};
