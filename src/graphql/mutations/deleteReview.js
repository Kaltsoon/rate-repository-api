import { gql, UserInputError, ForbiddenError } from 'apollo-server';

export const typeDefs = gql`
  extend type Mutation {
    """
    Deletes the review which has the given id, if it is created by the authorized user.
    """
    deleteReview(id: ID!): Boolean
  }
`;

export const resolvers = {
  Mutation: {
    deleteReview: async (obj, args, { models: { Review }, authService }) => {
      const userId = authService.assertIsAuthorized();

      const review = await Review.query().findById(args.id);

      if (!review) {
        throw new UserInputError(`Review with id ${args.id} does not exist`);
      }

      if (review.userId !== userId) {
        throw new ForbiddenError('User is not authorized to delete the review');
      }

      await Review.query()
        .findById(args.id)
        .delete();

      return true;
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
