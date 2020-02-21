import { Model } from 'objection';

export class BaseModel extends Model {
  static get useLimitInFirst() {
    return true;
  }

  $beforeInsert() {
    if (!this.createdAt) {
      this.createdAt = new Date();
    }
  }

  $beforeUpdate() {
    if (!this.updatedAt) {
      this.updatedAt = new Date();
    }
  }
}

export default BaseModel;
