import { ServerRoute } from '@hapi/hapi';
import joi from 'joi';

import * as controller from '../controllers/user-controller'

const userRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/users',
    handler: controller.getUsers,
    options: {
      tags: ['users']
    }
  },
  {
    method: 'POST',
    path: '/users',
    handler: controller.createUser,
    options: {
      tags: ['users'],
      validate: {
        payload: joi.object({
          name_first: joi.string().required(),
          name_last: joi.string().required(),
          email_address: joi.string().required(),
          phone_number: joi.string().required(),
          social_security_number: joi.string().required(),
          date_of_birth: joi.string().required(),
        }).required()
      }
    }
  },
  {
    method: 'POST',
    path: '/users/search',
    handler: controller.searchUsers,
    options: {
      tags: ['users'],
      validate: {
        payload: joi.object({
          filters: joi.object({
            date_of_birth: joi.array().items(joi.string()),
            email_address: joi.array().items(joi.string()),
            name_first: joi.array().items(joi.string()),
            name_last: joi.array().items(joi.string()),
            phone_number: joi.array().items(joi.string()),
            social_security_number: joi.array().items(joi.string()),
            user_token: joi.array().items(joi.string())
          }).required()
        }).required()
      }
    }
  },
  {
    method: 'GET',
    path: '/users/{userToken}',
    handler: controller.getUser,
    options: {
      tags: ['users'],
      validate: {
        params: joi.object({
          userToken: joi.string().required()
        }).required()
      }
    }
  },
];

export default userRoutes;
