import ExtendableError from 'es6-error';

export class ApplicationError extends ExtendableError {
  constructor(message, properties, statusCode, code) {
    super(message);

    this.message = message || 'Something went wrong';
    this.properties = properties || null;
    this.statusCode = statusCode || 500;
    this.code = code || 'INTERNAL_SERVER_ERROR';
  }

  toJSON() {
    return {
      message: this.message,
      properties: this.properties,
      statusCode: this.statusCode,
      code: this.code,
    };
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message, properties) {
    super(
      message || 'The requested resource is not found',
      properties,
      404,
      'NOT_FOUND',
    );
  }
}
