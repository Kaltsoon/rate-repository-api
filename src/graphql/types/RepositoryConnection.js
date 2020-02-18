import { gql } from 'apollo-server';

export const typeDefs = gql`
  type RepositoryEdge {
    cursor: String!
    node: Repository!
  }

  type RepositoryConnection {
    pageInfo: PageInfo!
    edges: [RepositoryEdge!]!
  }
`;

export const resolvers = {};

export default {
  typeDefs,
  resolvers,
};
