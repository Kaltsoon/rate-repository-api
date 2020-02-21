import { gql } from 'apollo-server';

export const typeDefs = gql`
  type PageInfo {
    hasNextPage: Boolean!
    totalCount: Int!
    startCursor: String
    endCursor: String
  }
`;

export const resolvers = {};

export default {
  typeDefs,
  resolvers,
};
