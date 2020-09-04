import { gql } from 'apollo-server';

export const typeDefs = gql`
  extend type Query {
    """
    Returns the authorized user.
    """
    authorizedUser: User
  }
`;

export const resolvers = {
  Query: {
    authorizedUser: (
      obj,
      args,
      { dataLoaders: { userLoader }, authService },
    ) => {
      const userId = authService.getUserId();

      if (!userId) {
        return null;
      }

      return userLoader.load(userId);
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
