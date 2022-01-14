import { gql } from 'apollo-server';
import { merge } from 'lodash';

import Repository from './types/Repository';
import repositoryQuery from './queries/repository';
import User from './types/User';
import createUserMutation from './mutations/createUser';
import authenticateMutation from './mutations/authenticate';
import usersQuery from './queries/users';
import meQuery from './queries/me';
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

export const typeDefs = [
  rootTypeDefs,
  DateTime.typeDefs,
  Repository.typeDefs,
  repositoryQuery.typeDefs,
  User.typeDefs,
  createUserMutation.typeDefs,
  authenticateMutation.typeDefs,
  usersQuery.typeDefs,
  meQuery.typeDefs,
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

export const resolvers = merge(
  DateTime.resolvers,
  Repository.resolvers,
  repositoryQuery.resolvers,
  User.resolvers,
  createUserMutation.resolvers,
  authenticateMutation.resolvers,
  usersQuery.resolvers,
  meQuery.resolvers,
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
