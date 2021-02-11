const serializeCursor = payload => {
  return Buffer.from(JSON.stringify(payload)).toString('base64');
};

export default serializeCursor;
