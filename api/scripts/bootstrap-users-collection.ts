import { faker } from '@faker-js/faker';

import { Logger, LogLevel } from '../src/lib/logger';
import { createMongoConnection } from '../src/lib/mongo';
import { baseConfig, loadConfig } from '../src/config';
import pkg from '../package.json';
import { NewUserPayload } from '../src/types/users';
import { formatDate } from '../src/lib/helpers';
import { generateUserToken } from '../src/lib/token-generator';
import { saveNewUser } from '../src/repositories/users';

const generatePhoneNumber = () => {
  const number = faker.phone.number();
  return number.replace(/-/g, '');
};

const generateSSN = () => {
  let text = '';
  const SSN_LENGTH = 9;
  const CHARACTER_LIST = '0123456789';

  for (var i = 0; i < SSN_LENGTH; i++) {
    text += CHARACTER_LIST.charAt(
      Math.floor(Math.random() * CHARACTER_LIST.length)
    );
  }

  return text;
};

const createUser = async () => {
  const payload: NewUserPayload = {
    date_of_birth: formatDate(faker.date.birthdate().toISOString()),
    email_address: faker.internet.email(),
    name_first: faker.person.firstName(),
    name_last: faker.person.lastName(),
    phone_number: generatePhoneNumber(),
    social_security_number: generateSSN(),
    user_token: generateUserToken(),
    created_at: new Date()
  };

  await saveNewUser(payload);
}

export const generatePlaintextUserCollectionData = async (
  skipAwsSecrets = false,
  logLevel: LogLevel = 'info',
  numOfRecordsToCreate: number = 10
) => {
  const logger = new Logger({
    name: `${pkg.name}-${baseConfig.SERVER_UID}`,
    stream: process.stdout,
    level: logLevel
  });

  const config = await loadConfig(logger, skipAwsSecrets);

  // setup mongo
  await createMongoConnection(config);

  for (var i = 0; i < numOfRecordsToCreate; i++) {
    await createUser();
  }
};

generatePlaintextUserCollectionData()
  .then(() => {
    console.log('Done!')
    process.exit(0);
  })
  .catch(err => {
    console.error({
      stack: err.stack,
      message: err.message
    }, 'Failure bootstrapping user collection');

    process.exit(1);
  });
