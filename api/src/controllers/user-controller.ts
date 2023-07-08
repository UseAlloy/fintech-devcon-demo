import crypto from 'crypto';

import { Request as hapiRequest } from '@hapi/hapi';

import { findUsers, saveNewUser } from '../repositories/users';
import { NewUserPayload } from '../types/users';
import { Logger } from '../lib/logger';
import { generateUserToken } from '../lib/token-generator';

type Request = hapiRequest & {
  logger: Logger
}

type CreateUserPayload = {
  name_first: string;
  name_last: string;
  email_address: string;
  password: string;
  password_confirm: string;
};

const isValidPassword = (val1: string, val2: string) => {
  if (val1.length < 8) return false;
  if (val1 !== val2) return false;

  return true;
};

const hashPassword = (val: string) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(val, salt, 1000, 64, 'sha512').toString('hex');

  return [salt, hash];
};

export const getUsers = async (request: Request, reply) => {
  const { logger } = request;

  try {
    const records = await findUsers();

    return reply.response(records).code(200);
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
  const payload = request.payload as CreateUserPayload;

  const validPassword = isValidPassword(payload.password, payload.password_confirm);
  if (!validPassword) {
    return reply.response({
      errors: [{
        status: 400,
        detail: 'Failed password validation'
      }]
    }).code(400);
  }

  try {
    const [hash, salt] = hashPassword(payload.password);
    const newUserPayload: NewUserPayload = {
      name_first: payload.name_first,
      name_last: payload.name_last,
      email_address: payload.email_address,
      user_token: generateUserToken(),
      hash,
      salt,
      created_at: new Date()
    };

    const newUser = await saveNewUser(newUserPayload);

    return reply.response(newUser).code(201);
  } catch (err) {
    console.error({
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
