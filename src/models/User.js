import BaseModel from './BaseModel';

class User extends BaseModel {
  static get idColumn() {
    return 'id';
  }

  static get tableName() {
    return 'users';
  }
}

export default User;