import mongoose, { Schema } from 'mongoose';

import { UserRecord } from '../types/users';

const UsersCollection = new Schema<UserRecord>({
  date_of_birth: {
    type: Schema.Types.String,
    required: true
  },
  email_address: {
    type: Schema.Types.String,
    required: true
  },
  name_first: {
    type: Schema.Types.String,
    required: true
  },
  name_last: {
    type: Schema.Types.String,
    required: true
  },
  phone_number: {
    type: Schema.Types.String,
    required: true
  },
  social_security_number: {
    type: Schema.Types.String,
    required: true
  },
  user_token: {
    type: Schema.Types.String,
    required: true
  },
  created_at: {
    type: Schema.Types.Date,
    default: new Date()
  }
});

UsersCollection.index(
  { name_first: 1, name_last: 1, social_security_number: 1 },
  { unique: true }
);

export const Users = mongoose.model<UserRecord>(
  'users',
  UsersCollection
);
