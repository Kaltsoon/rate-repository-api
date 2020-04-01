import ExtendableError from 'es6-error';

export class ApplicationError extends ExtendableError {
  constructor(message, properties = {}) {
    super();

    this.message = message || 'Something went wrong';
    this.properties = properties;
    this.statusCode = 500;
    this.code = 'APPLICATION_ERROR';
  }

  toJson() {
    return {
      message: this.message,
      properties: this.properties,
      statusCode: this.statusCode,
      code: this.code,
    };
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message, properties = {}) {
    super(message || 'The requested resource is not found', properties);

    this.statusCode = 404;
    this.code = 'NOT_FOUND_ERROR';
  }
}
