import { makeExecutableSchema, gql } from 'apollo-server';
import { merge } from 'lodash';

import Repository from './types/Repository';
import repositoryQuery from './queries/repository';
import User from './types/User';
import createUserMutation from './mutations/createUser';
import authorizeMutation from './mutations/authorize';
import usersQuery from './queries/users';
import authorizedUserQuery from './queries/authorizedUser';
import repositoriesQuery from './queries/repositories';
import PageInfo from './types/PageInfo';
import RepositoryConnection from './types/RepositoryConnection';
import OrderDirection from './enums/OrderDirection';
import createReviewMutation from './mutations/createReview';
import Review from './types/Review';
import ReviewConnection from './types/ReviewConnection';
import UserConnection from './types/UserConnection';
import deleteReviewMutation from './mutations/deleteReview';
import DateTime from './scalars/DateTime';

const rootTypeDefs = gql`
  type Query {
    root: String
  }

  type Mutation {
    root: String
  }
`;

const typeDefs = [
  rootTypeDefs,
  DateTime.typeDefs,
  Repository.typeDefs,
  repositoryQuery.typeDefs,
  User.typeDefs,
  createUserMutation.typeDefs,
  authorizeMutation.typeDefs,
  usersQuery.typeDefs,
  authorizedUserQuery.typeDefs,
  repositoriesQuery.typeDefs,
  PageInfo.typeDefs,
  RepositoryConnection.typeDefs,
  OrderDirection.typeDefs,
  createReviewMutation.typeDefs,
  Review.typeDefs,
  ReviewConnection.typeDefs,
  UserConnection.typeDefs,
  deleteReviewMutation.typeDefs,
];

const resolvers = merge(
  DateTime.resolvers,
  Repository.resolvers,
  repositoryQuery.resolvers,
  User.resolvers,
  createUserMutation.resolvers,
  authorizeMutation.resolvers,
  usersQuery.resolvers,
  authorizedUserQuery.resolvers,
  repositoriesQuery.resolvers,
  PageInfo.resolvers,
  RepositoryConnection.resolvers,
  OrderDirection.resolvers,
  createReviewMutation.resolvers,
  Review.resolvers,
  ReviewConnection.resolvers,
  UserConnection.resolvers,
  deleteReviewMutation.resolvers,
);

const createSchema = () => {
  return makeExecutableSchema({
    typeDefs,
    resolvers,
  });
};

export default createSchema;
