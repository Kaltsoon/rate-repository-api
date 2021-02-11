import BaseModel from './BaseModel';
import knex from '../utils/knex';

class User extends BaseModel {
  static get idColumn() {
    return 'id';
  }

  static get tableName() {
    return 'users';
  }
}

export default User.bindKnex(knex);
