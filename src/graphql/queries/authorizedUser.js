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
    authorizedUser: (obj, args, { models, authService }) => {
      const { User } = models;

      const userId = authService.assertIsAuthorized();

      return User.query().findById(userId);
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
