import ExtendableError from 'es6-error';

export class ApplicationError extends ExtendableError {
  constructor(message, properties = {}) {
    super();

    this.message = message;
    this.properties = properties;
    this.statusCode = 500;
    this.type = 'APPLICATION_ERROR';
  }

  toJson() {
    return {
      message: this.message,
      properties: this.properties,
      statusCode: this.statusCode,
      type: this.type,
    };
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message, properties = {}) {
    super(message, properties);

    this.statusCode = 404;
    this.type = 'NOT_FOUND_ERROR';
  }
}
