import { gql } from 'apollo-server';
import * as yup from 'yup';
import uuid from 'uuid/v4';
import bcrypt from 'bcrypt';

export const typeDefs = gql`
  input CreateUserInput {
    username: String!
    password: String!
  }

  extend type Mutation {
    """
    Creates a new user, if the provided username does not already exist.
    """
    createUser(user: CreateUserInput): User
  }
`;

const createUserInputSchema = yup.object({
  username: yup
    .string()
    .min(1)
    .max(100)
    .trim(),
  password: yup
    .string()
    .min(5)
    .max(100)
    .trim(),
});

export const resolvers = {
  Mutation: {
    createUser: async (obj, args, { models }) => {
      const { User } = models;

      const normalizedUser = await createUserInputSchema.validate(args.user, {
        stripUnknown: true,
      });

      const passwordHash = await bcrypt.hash(normalizedUser.password, 10);

      const id = uuid();

      await User.query().insert({
        ...normalizedUser,
        password: passwordHash,
        id,
      });

      return User.query().findById(id);
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
