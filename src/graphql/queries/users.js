import { gql } from 'apollo-server';
import * as yup from 'yup';

import createPaginatedQuery from '../../utils/createPaginatedQuery';

export const typeDefs = gql`
  extend type Query {
    users(first: Int, after: String): UserConnection!
  }
`;

const usersArgsSchema = yup.object({
  after: yup.string(),
  first: yup
    .number()
    .min(1)
    .max(40)
    .default(40),
});

export const resolvers = {
  Query: {
    users: async (obj, args, { models: { User } }) => {
      const normalizedArgs = await usersArgsSchema.validate(args);

      return createPaginatedQuery(() => User.query(), {
        orderColumn: 'createdAt',
        orderDirection: 'desc',
        first: normalizedArgs.first,
        after: normalizedArgs.after,
      });
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
