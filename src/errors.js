import ExtendableError from 'es6-error';

export class ApplicationError extends ExtendableError {
  constructor(message, status, properties) {
    super(message);

    this.message = message || 'Something went wrong';
    this.status = status || 500;
    this.properties = properties || null;
  }

  toJSON() {
    return {
      message: this.message,
      properties: this.properties,
      status: this.status,
    };
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message, properties) {
    super(message || 'The requested resource is not found', 404, properties);
  }
}
