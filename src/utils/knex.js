import createKnex from 'knex';

import { KNEX_CONFIG } from '../config';

const knex = createKnex(KNEX_CONFIG);

export default knex;
