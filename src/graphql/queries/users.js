import { gql } from 'apollo-server';
import * as yup from 'yup';

import createPaginationQuery from '../../utils/createPaginationQuery';

export const typeDefs = gql`
  extend type Query {
    """
    Returns paginated users.
    """
    users(first: Int, after: String): UserConnection!
  }
`;

const usersArgsSchema = yup.object({
  after: yup.string(),
  first: yup
    .number()
    .min(1)
    .max(30)
    .default(30),
});

export const resolvers = {
  Query: {
    users: async (obj, args, { models: { User } }) => {
      const normalizedArgs = await usersArgsSchema.validate(args);

      return createPaginationQuery(() => User.query(), {
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
