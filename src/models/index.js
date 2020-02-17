import User from './User';
import Repository from './Repository';
import Review from './Review';

export const bindModels = knex => {
  return {
    User: User.bindKnex(knex),
    Repository: Repository.bindKnex(knex),
    Review: Review.bindKnex(knex),
  };
};

export default bindModels;