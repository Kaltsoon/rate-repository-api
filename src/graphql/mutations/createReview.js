import { gql, UserInputError } from 'apollo-server';
import * as yup from 'yup';

export const typeDefs = gql`
  input CreateReviewInput {
    repositoryName: String!
    ownerName: String!
    rating: Int!
    text: String
  }

  extend type Mutation {
    createReview(review: CreateReviewInput): Review
  }
`;

const createRepositoryId = (ownerUsername, repositoryName) => [ownerUsername, repositoryName].join('/');

const createReviewInputSchema = yup.object({
  repositoryName: yup
    .string()
    .required()
    .trim(),
  ownerName: yup
    .string()
    .required()
    .trim(),
  rating: yup.number().integer().min(0).max(100).required(),
  text: yup.string().trim(),
});

export const resolvers = {
  Mutation: {
    createReview: async (
      obj,
      args,
      { models: { Repository, Review }, githubClient, authService },
    ) => {
      const userId = authService.assertIsAuthorized();

      const normalizedReview = await createReviewInputSchema.validate(
        args.review,
        {
          stripUnknown: true,
        },
      );

      const { repositoryName, ownerName } = normalizedReview;

      const existingRepository = await Repository.query().findOne({ name: repositoryName, ownerName });

      const repositoryId = existingRepository ? existingRepository.id : createRepositoryId(ownerName, repositoryName);

      if (!existingRepository) {
        const githubRepository = await githubClient.getRepository(
          ownerName,
          repositoryName,
        );
  
        if (!githubRepository) {
          throw new UserInputError(
            `Could not fetch repository ${repositoryName} owned by ${ownerName} from GitHub`,
          );
        }

        await Repository.query().insert({
          id: repositoryId,
          ownerName,
          name: repositoryName,
        });
      }

      const id = [userId, repositoryId].join('.');

      await Review.query().insert({
        id,
        userId,
        repositoryId,
        text: normalizedReview.text,
        rating: normalizedReview.rating,
      });

      return Review.query().findById(id);
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
