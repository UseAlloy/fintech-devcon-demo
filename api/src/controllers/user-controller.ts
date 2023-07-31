import crypto from 'crypto';

import { Request as hapiRequest } from '@hapi/hapi';

import { findUser, findUsers, saveNewUser } from '../repositories/users';
import { NewUserPayload, UserSearchFilters } from '../types/users';
import { Logger } from '../lib/logger';
import { generateUserToken } from '../lib/token-generator';
import { formatDate } from '../lib/helpers';

type Request = hapiRequest & {
  logger: Logger
}

type CreateUserPayload = {
  date_of_birth: string;
  email_address: string;
  name_first: string;
  name_last: string;
  phone_number: string;
  social_security_number: string;
};

type SearchUsersPayload = {
  filters: UserSearchFilters
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
  const logger = request.logger;
  const payload = request.payload as CreateUserPayload;

  try {
    const newUserPayload: NewUserPayload = {
      date_of_birth: formatDate(payload.date_of_birth),
      email_address: payload.email_address,
      name_first: payload.name_first,
      name_last: payload.name_last,
      phone_number: payload.phone_number,
      social_security_number: payload.social_security_number,
      user_token: generateUserToken(),
      created_at: new Date()
    };

    const newUser = await saveNewUser(newUserPayload);

    return reply.response(newUser).code(201);
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
  const { logger, params: { userToken } } = request;

  try {
    const record = await findUser(userToken);

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
  const logger = request.logger;
  const { filters } = request.payload as SearchUsersPayload;

  try {
    const users = await findUsers(filters);

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
