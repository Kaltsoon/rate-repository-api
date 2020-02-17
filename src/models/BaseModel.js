import { Model } from 'objection';

export class BaseModel extends Model {
  static get useLimitInFirst() {
    return true;
  }

  $beforeInsert() {
    if (!this.createdAt) {
      this.createdAt = new Date().toISOString();
    }
  }

  $beforeUpdate() {
    if (!this.updatedAt) {
      this.updatedAt = new Date().toISOString();
    }
  }
}

export default BaseModel;