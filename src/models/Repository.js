import BaseModel from './BaseModel';
import knex from '../utils/knex';

class Repository extends BaseModel {
  static get idColumn() {
    return 'id';
  }

  static get tableName() {
    return 'repositories';
  }
}

export default Repository.bindKnex(knex);
