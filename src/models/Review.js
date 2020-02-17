import BaseModel from './BaseModel';

class Review extends BaseModel {
  static get idColumn() {
    return 'id';
  }

  static get tableName() {
    return 'reviews';
  }
}

export default Review;