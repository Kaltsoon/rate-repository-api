import { gql } from 'apollo-server';

export const typeDefs = gql`
  extend type Query {
    repository(id: String!): Repository
  }
`;

export const resolvers = {
  Query: {
    repository: async (obj, args, { dataLoaders: { repositoryLoader } }) => {
      return repositoryLoader.load(args.id);
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
