import { Model } from 'objection';

export class BaseModel extends Model {
  static get useLimitInFirst() {
    return true;
  }

  $parseDatabaseJson(json) {
    let parsedJson = super.$parseDatabaseJson(json);

    if (typeof parsedJson.createdAt === 'number') {
      parsedJson.createdAt = new Date(parsedJson.createdAt);
    }

    if (typeof parsedJson.updatedAt === 'number') {
      parsedJson.updatedAt = new Date(parsedJson.updatedAt);
    }

    return parsedJson;
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
