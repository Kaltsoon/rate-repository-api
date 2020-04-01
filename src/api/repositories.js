import Router from 'koa-router';

import createPaginationQuery from '../utils/createPaginationQuery';

const router = new Router();

const getNormalizedRepository = repository => ({
  id: repository.id,
  name: repository.name,
  ownerName: repository.ownerName,
  createdAt: repository.createdAt ? new Date(repository.createdAt) : null,
  fullName: [repository.ownerName, repository.name].join('/'),
});

router.get('/', async ctx => {
  const {
    models: { Repository },
  } = ctx;

  const data = await createPaginationQuery(() => Repository.query(), {
    orderColumn: 'createdAt',
  });

  ctx.body = {
    ...data,
    edges: data.edges.map(edge => ({
      ...edge,
      node: getNormalizedRepository(edge.node),
    })),
  };
});

export default router;
