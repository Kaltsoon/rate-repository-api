import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config';

const verifyJwt = (token, options) => {
  return jwt.verify(token, JWT_SECRET, options);
};

export default verifyJwt;
