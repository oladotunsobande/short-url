import { Request, Response, NextFunction } from 'express';
import ResponseHandler from '../util/response-handler';
import { ResponseType } from '../types';
import { redisAsync } from '../util/redis';

export async function cache(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  const combinedPayload = { ...req.body, ...req.params };

  const { url, token } = combinedPayload;

  try {
    if (url) {
      const urlBase64 = Buffer.from(url.trim()).toString('base64');

      const value = await redisAsync.get(urlBase64);
      if (value) {
        const { shortLink } = JSON.parse(value);

        return ResponseHandler.sendSuccessResponse({
          res,
          message: 'URL encoded successfully',
          data: { encodedURL: shortLink },
        });
      }
    } else if (token) {
      const value = await redisAsync.get(token);
      if (value) {
        const longURL = Buffer.from (value, 'base64').toString('ascii');

        return ResponseHandler.sendSuccessResponse({
          res,
          message: 'URL decoded successfully',
          data: { longURL },
        });
      }
    } else {
      return ResponseHandler.sendErrorResponse({
        res,
        error: 'Unrecognized parameter passed',
      });
    }

    return next();
  } catch (error) {
    return next(error);
  }
}