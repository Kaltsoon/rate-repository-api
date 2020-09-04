import { gql } from 'apollo-server';
import * as yup from 'yup';

import createPaginationQuery from '../../utils/createPaginationQuery';

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    createdAt: DateTime!
    reviews(first: Int, after: String): ReviewConnection!
    reviewCount: Int!
  }
`;

const reviewsArgsSchema = yup.object({
  after: yup.string(),
  first: yup
    .number()
    .min(1)
    .max(30)
    .default(30),
});

export const resolvers = {
  User: {
    reviews: async (obj, args, { models: { Review } }) => {
      const normalizedArgs = await reviewsArgsSchema.validate(args);

      return createPaginationQuery(
        () =>
          Review.query().where({
            userId: obj.id,
          }),
        {
          orderColumn: 'createdAt',
          orderDirection: 'desc',
          first: normalizedArgs.first,
          after: normalizedArgs.after,
        },
      );
    },
    reviewCount: async (
      { id },
      args,
      { dataLoaders: { userReviewCountLoader } },
    ) => userReviewCountLoader.load(id),
  },
};

export default {
  typeDefs,
  resolvers,
};
