import DataLoader from 'dataloader';
import { camelCase, isArray, find, zipObject } from 'lodash';

const createModelLoader = Model =>
  new DataLoader(async ids => {
    const idColumns = isArray(Model.idColumn)
      ? Model.idColumn
      : [Model.idColumn];

    const camelCasedIdColumns = idColumns.map(id => camelCase(id));

    const results = await Model.query().findByIds(ids);

    return ids.map(
      id =>
        find(
          results,
          zipObject(camelCasedIdColumns, isArray(id) ? id : [id]),
        ) || null,
    );
  });

const createRepositoryRatingAverageLoader = Review =>
  new DataLoader(async repositoryIds => {
    const reviews = await Review.query()
      .whereIn('repositoryId', repositoryIds)
      .avg('rating', { as: 'ratingAverage' })
      .groupBy('repositoryId')
      .select('repositoryId');

    return repositoryIds.map(id => {
      const review = reviews.find(({ repositoryId }) => repositoryId === id);

      return review ? review.ratingAverage : 0;
    });
  });

const createRepositoryReviewCountLoader = Review =>
  new DataLoader(async repositoryIds => {
    const reviews = await Review.query()
      .whereIn('repositoryId', repositoryIds)
      .count('*', { as: 'reviewsCount' })
      .groupBy('repositoryId')
      .select('repositoryId');

    return repositoryIds.map(id => {
      const review = reviews.find(({ repositoryId }) => repositoryId === id);

      return review ? review.reviewsCount : 0;
    });
  });

export const createDataLoaders = ({ models }) => {
  return {
    repositoryLoader: createModelLoader(models.Repository),
    userLoader: createModelLoader(models.User),
    reviewLoader: createModelLoader(models.Review),
    repositoryRatingAverageLoader: createRepositoryRatingAverageLoader(
      models.Review,
    ),
    repositoryReviewCountLoader: createRepositoryReviewCountLoader(
      models.Review,
    ),
  };
};

export default createDataLoaders;
