import Router from 'koa-router';
import { get } from 'lodash';

import createPaginationQuery from '../utils/createPaginationQuery';

const router = new Router();

const getNormalizedRepository = (
  repository,
  githubRepository,
  reviewCount,
  ratingAverage,
) => ({
  id: repository.id,
  name: repository.name,
  ownerName: repository.ownerName,
  createdAt: repository.createdAt ? new Date(repository.createdAt) : null,
  fullName: [repository.ownerName, repository.name].join('/'),
  reviewCount,
  ratingAverage: Math.round(ratingAverage),
  forksCount: get(githubRepository, 'forks_count') || 0,
  stargazersCount: get(githubRepository, 'stargazers_count') || 0,
  description: get(githubRepository, 'description') || null,
  language: get(githubRepository, 'language') || null,
  ownerAvatarUrl: get(githubRepository, 'owner.avatar_url') || null,
});

router.get('/', async ctx => {
  const {
    models: { Repository },
    githubClient,
    dataLoaders: { repositoryRatingAverageLoader, repositoryReviewCountLoader },
  } = ctx;

  const data = await createPaginationQuery(() => Repository.query(), {
    orderColumn: 'createdAt',
  });

  const repositoryIds = data.edges.map(edge => edge.node.id);

  const [githubRepositories, reviewCounts, ratingAverages] = await Promise.all([
    Promise.all(
      data.edges.map(edge =>
        githubClient.getRepository(edge.node.ownerName, edge.node.name),
      ),
    ),
    repositoryReviewCountLoader.loadMany(repositoryIds),
    repositoryRatingAverageLoader.loadMany(repositoryIds),
  ]);

  ctx.body = {
    ...data,
    edges: data.edges.map((edge, index) => ({
      ...edge,
      node: getNormalizedRepository(
        edge.node,
        githubRepositories[index],
        reviewCounts[index],
        ratingAverages[index],
      ),
    })),
  };
});

export default router;
