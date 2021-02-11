import { gql } from 'apollo-server';

export const typeDefs = gql`
  type PageInfo {
    hasPreviousPage: Boolean!
    hasNextPage: Boolean!
    startCursor: String
    endCursor: String
  }
`;

export const resolvers = {};

export default {
  typeDefs,
  resolvers,
};
