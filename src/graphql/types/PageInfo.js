import { gql } from 'apollo-server';

export const typeDefs = gql`
  type PageInfo {
    hasNextPage: Boolean!
    totalCount: Int!
  }
`;

export const resolvers = {};

export default {
  typeDefs,
  resolvers,
};
