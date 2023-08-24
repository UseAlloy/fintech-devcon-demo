
import { findUser, findUsers, saveNewUser } from '../repositories/users';
import { Request } from '../types/router';
import { decrypt, encrypt, hash } from '../lib/encryption';
import {
  CreateUserPayload,
  DecryptedUser,
  EncryptedUser,
  SearchUsersPayload,
  User,
  UserPIISearchFilters,
  UserSearchFilters
} from '../types/users';
import { generateUserToken } from '../lib/token-generator';
import { formatDate } from '../lib/helpers';

export const formatNewUser = async (
  payload: CreateUserPayload,
  encryptionKey: Buffer,
  hashKey: Buffer
): Promise<User> => ({
  date_of_birth: formatDate(payload.date_of_birth),
  date_of_birth_encrypted: await encrypt(payload.date_of_birth, encryptionKey),
  date_of_birth_hashed: hash(payload.date_of_birth, hashKey),
  email_address: payload.email_address,
  email_address_encrypted: await encrypt(payload.email_address, encryptionKey),
  email_address_hashed: hash(payload.email_address, hashKey),
  name_first: payload.name_first,
  name_first_encrypted: await encrypt(payload.name_first, encryptionKey),
  name_first_hashed: hash(payload.name_first, hashKey),
  name_last: payload.name_last,
  name_last_encrypted: await encrypt(payload.name_last, encryptionKey),
  name_last_hashed: hash(payload.name_last, hashKey),
  phone_number: payload.phone_number,
  phone_number_encrypted: await encrypt(payload.phone_number, encryptionKey),
  phone_number_hashed: hash(payload.phone_number, hashKey),
  social_security_number: payload.social_security_number,
  social_security_number_encrypted: await encrypt(payload.social_security_number, encryptionKey),
  social_security_number_hashed: hash(payload.social_security_number, hashKey),
  user_token: generateUserToken(),
  created_at: new Date()
});

const decryptUser = (
  user: EncryptedUser,
  encryptionKey: Buffer
): DecryptedUser => ({
  date_of_birth: formatDate(decrypt(user.date_of_birth_encrypted, encryptionKey)),
  email_address: decrypt(user.email_address_encrypted, encryptionKey),
  name_first: decrypt(user.name_first_encrypted, encryptionKey),
  name_last: decrypt(user.name_last_encrypted, encryptionKey),
  phone_number: decrypt(user.phone_number_encrypted, encryptionKey),
  social_security_number: decrypt(user.social_security_number_encrypted, encryptionKey),
  user_token: user.user_token,
  created_at: user.created_at,
});

const hashSearchFilters = (
  filters: UserSearchFilters,
  hashKey: Buffer
): UserPIISearchFilters => Object.keys(filters).reduce((acc, filter) => {
  if (filter === 'user_token') {
    acc[filter] = filters[filter];
  } else {
    acc[`${filter}_hashed`] = filters[filter].map(val => hash(val, hashKey));
  }

  return acc;
}, {});

export const getUsers = async (request: Request, reply) => {
  const { encryptionKeys, logger } = request;

  try {
    const encryptedUsers = await findUsers();
    const users = encryptedUsers.map(eu =>
      decryptUser(eu, encryptionKeys.piiEncryptionKey)
    );

    return reply.response(users).code(200);
  } catch (err) {
    logger.error({
      stack: err.stack,
      message: err.mesage
    }, 'Failed to get all users');

    return reply.response({
      errors: [{
        status: 400,
        detail: 'Failed to get all users'
      }]
    }).code(400);
  }
};

export const createUser = async (request: Request, reply) => {
  const { encryptionKeys, logger } = request;
  const payload = request.payload as CreateUserPayload;

  try {
    const newUserPayload = await formatNewUser(
      payload,
      encryptionKeys.piiEncryptionKey,
      encryptionKeys.piiHashSalt
    );

    const encryptedUser = await saveNewUser(newUserPayload);
    const user = decryptUser(encryptedUser, encryptionKeys.piiEncryptionKey);

    return reply.response(user).code(201);
  } catch (err) {
    logger.error({
      stack: err.stack,
      message: err.message
    }, 'Failed to create new user');

    return reply.response({
      errors: [{
        status: 500,
        detail: 'Failed to create new user'
      }]
    }).code(500);
  }
};

export const getUser = async (request: Request, reply) => {
  const { encryptionKeys, logger, params: { userToken } } = request;

  try {
    const encryptedUser = await findUser(userToken);
    const record = decryptUser(encryptedUser, encryptionKeys.piiEncryptionKey);

    return reply.response(record).code(200);
  } catch (err) {
    logger.error({
      stack: err.stack,
      message: err.message
    }, 'Failed to get user');

    return reply.response({
      errors: [{
        status: 400,
        detail: 'Failed to get user'
      }]
    }).code(400);
  }
};

export const searchUsers = async (request: Request, reply) => {
  const { encryptionKeys, logger } = request;
  const { filters } = request.payload as SearchUsersPayload;

  try {
    const hashedFilters = hashSearchFilters(filters, encryptionKeys.piiHashSalt);
    const encryptedUsers = await findUsers(hashedFilters);
    const users = encryptedUsers.map(eu =>
      decryptUser(eu, encryptionKeys.piiEncryptionKey)
    );

    return reply.response(users).code(200);
  } catch (err) {
    logger.error({
      stack: err.stack,
      message: err.message
    }, 'Failed to search users');

    return reply.response({
      errors: [{
        status: 500,
        detail: 'Failed to search users'
      }]
    }).code(500);
  }
};
