import Router from 'koa-router';

import getRepositories from './getRepositories';

const router = new Router();

router.get('/', getRepositories);

export default router;
