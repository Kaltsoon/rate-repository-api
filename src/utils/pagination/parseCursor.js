const parseCursor = cursor => {
  if (!cursor) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(cursor, 'base64').toString('utf8'));
  } catch (e) {
    return null;
  }
};

export default parseCursor;
