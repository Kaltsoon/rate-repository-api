import BaseModel from './BaseModel';

class Repository extends BaseModel {
  static get idColumn() {
    return 'id';
  }

  static get tableName() {
    return 'repositories';
  }
}

export default Repository;