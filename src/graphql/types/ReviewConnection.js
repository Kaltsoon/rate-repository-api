import { gql } from 'apollo-server';

export const typeDefs = gql`
  type ReviewEdge {
    cursor: String!
    node: Review!
  }

  type ReviewConnection {
    pageInfo: PageInfo!
    edges: [ReviewEdge!]!
  }
`;

export const resolvers = {};

export default {
  typeDefs,
  resolvers,
};
