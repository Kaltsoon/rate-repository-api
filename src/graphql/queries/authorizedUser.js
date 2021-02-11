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
    authorizedUser: (obj, args, { authService }) => {
      return authService.getAuthorizedUser();
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
