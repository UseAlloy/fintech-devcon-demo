import mongoose, { Schema } from 'mongoose';

import { UserRecord } from '../types/users';

const UsersCollection = new Schema<UserRecord>({
  name_first: {
    type: Schema.Types.String,
    required: true
  },
  name_last: {
    type: Schema.Types.String,
    required: true
  },
  email_address: {
    type: Schema.Types.String,
    required: true
  },
  salt: {
    type: Schema.Types.String,
    required: true
  },
  hash: {
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
  { name_first: 1, name_last: 1, email_address: 1 },
  { unique: true }
);

export const Users = mongoose.model<UserRecord>(
  'users',
  UsersCollection
);
