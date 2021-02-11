import BaseModel from './BaseModel';
import knex from '../utils/knex';

class Review extends BaseModel {
  static get idColumn() {
    return 'id';
  }

  static get tableName() {
    return 'reviews';
  }
}

export default Review.bindKnex(knex);
