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
          password: joi.string().required(),
          password_confirm: joi.string().required()
        }).required()
      }
    }
  },
  // {
  //   method: 'GET',
  //   path: '/users/${userToken}',
  //   handler: () => {},
  //   options: {
  //     tags: ['users'],
  //     validate: {
  //       params: joi.object({
  //         userToken: joi.string()
  //       })
  //     }
  //   }
  // }
];

export default userRoutes;
