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

  const { longURL, shortURL } = combinedPayload;

  try {
    if (longURL) {
      const urlBase64 = Buffer.from(longURL.trim()).toString('base64');

      const value = await redisAsync.get(urlBase64);
      if (value) {
        const { shortLink } = JSON.parse(value);

        return ResponseHandler.sendSuccessResponse({
          res,
          message: 'URL encoded successfully',
          data: { shortURL: shortLink },
        });
      }
    } else if (shortURL) {
      const pathname = new URL(shortURL.trim()).pathname;
      const token = pathname.substring(1);

      const value = await redisAsync.get(token);
      if (value) {
        const longURL = Buffer.from (value, 'base64').toString('ascii');

        return ResponseHandler.sendSuccessResponse({
          res,
          message: 'URL decoded successfully',
          data: { longURL },
        });
      }
    } 

    return next();
  } catch (error) {
    return next(error);
  }
}