import { faker } from '@faker-js/faker';

const userPassword = faker.internet.password();
export const createUserInput = {
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: userPassword,
  passwordConfirmation: userPassword,
};

export const signInUserInput = {
  email: faker.internet.email(),
  password: faker.internet.password(),
};
