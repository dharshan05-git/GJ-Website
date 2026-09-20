import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError.js';

/** Place after a chain of express-validator rules to turn failures into a 400. */
export const validate = (req, _res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = result.array().map((e) => ({ field: e.path, message: e.msg }));
  next(ApiError.badRequest('Validation failed', errors));
};
