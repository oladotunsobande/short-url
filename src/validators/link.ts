import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { ResponseType } from '../types';
import ResponseHandler from '../util/response-handler';
import * as env from '../config/env';

export async function validateLinkEncode(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  const schema = Joi.object().keys({
    longURL: Joi.string().uri().required()
  })
  .unknown(true);

  const validation = schema.validate(req.body);
  if (validation.error) {
    const error = validation.error.message
      ? validation.error.message
      : validation.error.details[0].message;
    return ResponseHandler.sendErrorResponse({
      res,
      error,
    });
  }

  return next();
}

export async function validateLinkDecode(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  const schema = Joi.object().keys({
    shortURL: Joi.string().uri().required()
  })
  .unknown(true);

  const validation = schema.validate(req.body);
  if (validation.error) {
    const error = validation.error.message
      ? validation.error.message
      : validation.error.details[0].message;
    return ResponseHandler.sendErrorResponse({
      res,
      error,
    });
  }

  const { hostname, pathname } = new URL(req.body.shortURL.trim());

  if (!env.SERVICE_URL.endsWith(hostname)) {
    return ResponseHandler.sendErrorResponse({
      res,
      error: 'Invalid service hostname provided',
    });
  }

  const lastIndex = pathname.lastIndexOf('/');
  if (lastIndex > 0) {
    return ResponseHandler.sendErrorResponse({
      res,
      error: 'Invalid short URL provided',
    });
  }

  return next();
}

export async function validateGetTokenDetails(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  const schema = Joi.object().keys({
    token: Joi.string().required()
  });

  const validation = schema.validate(req.params);
  if (validation.error) {
    const error = validation.error.message
      ? validation.error.message
      : validation.error.details[0].message;
    return ResponseHandler.sendErrorResponse({
      res,
      error,
    });
  }

  return next();
}