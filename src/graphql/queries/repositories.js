import { gql } from 'apollo-server';
import { ref } from 'objection';
import * as yup from 'yup';

import createPaginatedQuery from '../../utils/createPaginatedQuery';

export const typeDefs = gql`
  enum AllRepositoriesOrderBy {
    CREATED_AT
    RATING_AVERAGE
  }

  extend type Query {
    """
    Returns paginated repositories.
    """
    repositories(
      after: String
      first: Int
      orderDirection: OrderDirection
      orderBy: AllRepositoriesOrderBy
      searchKeyword: String
      ownerName: String
    ): RepositoryConnection!
  }
`;

const repositoriesArgsSchema = yup.object({
  after: yup.string(),
  first: yup
    .number()
    .min(1)
    .max(40)
    .default(40),
  orderDirection: yup.string().default('DESC'),
  orderBy: yup.string().default('CREATED_AT'),
  searchKeyword: yup.string().trim(),
  ownerName: yup.string().trim(),
});

const orderColumnByOrderBy = {
  CREATED_AT: 'createdAt',
  RATING_AVERAGE: 'ratingAverage',
};

const getLikeFilter = value => `%${value}%`;

export const resolvers = {
  Query: {
    repositories: async (obj, args, { models: { Repository, Review } }) => {
      const normalizedArgs = await repositoriesArgsSchema.validate(args);
      const {
        first,
        orderDirection,
        after,
        orderBy,
        searchKeyword,
        ownerName,
      } = normalizedArgs;

      const orderColumn = orderColumnByOrderBy[orderBy];

      let query = Repository.query();

      if (ownerName) {
        query = query.where({
          ownerName,
        });
      } else if (searchKeyword) {
        const likeFilter = getLikeFilter(searchKeyword);

        query = query
          .where('ownerName', 'like', likeFilter)
          .orWhere('name', 'like', likeFilter);
      }

      if (orderColumn === 'ratingAverage') {
        query = query.select([
          'repositories.*',
          Review.query()
            .where({ repositoryId: ref('repositories.id') })
            .avg('rating')
            .as('ratingAverage')
            .groupBy('repositoryId'),
        ]);
      }

      return createPaginatedQuery(() => query.clone(), {
        first,
        after,
        orderDirection: orderDirection.toLowerCase(),
        orderColumn,
      });
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
