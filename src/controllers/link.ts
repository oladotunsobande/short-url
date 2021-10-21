import { Request, Response, NextFunction } from 'express';
import { ResponseType } from '../types';
import ResponseHandler from '../util/response-handler';
import * as env from '../config/env';
import * as Helper from '../helpers';
import LinkRepository from '../repositories/LinkRepository';
import UrlCacheService from '../services/UrlCacheService';

export async function encodeURL(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  const { url } = req.body;

  try {
    let token: string;

    let link = await LinkRepository.getOneBy({
      longURL: url,
    });
    if (link) {
      await LinkRepository.update(
        link._id, 
        {
          isActive: true,
          validityDays: parseInt(env.LINK_VALIDITY_DAYS),
        },
      );

      token = link.token;
    } else {
      token = Helper.generateToken();

      link = await LinkRepository.create({
        token,
        longURL: url,
        validityDays: parseInt(env.LINK_VALIDITY_DAYS),
      });
    }

    const shortLink = `${env.SERVICE_URL}/${token}`;

    const urlCache = new UrlCacheService();
    urlCache.setURLInCache(
      url,
      token,
      link._id,
      shortLink,
    );
    urlCache.urlExpiryInCacheListener();

    return ResponseHandler.sendSuccessResponse({
      res,
      message: 'URL encoded successfully',
      data: { encodedURL: shortLink },
    });
  } catch (error) {
    return next(error);
  }
}

export async function decodeURL(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  const { token } = req.params;

  try {
    let link = await LinkRepository.getOneBy({ token });
    if (!link) {
      return ResponseHandler.sendErrorResponse({
        res,
        status: 404,
        error: 'Link record does not exist',
      });
    }

    return ResponseHandler.sendSuccessResponse({
      res,
      message: 'URL decoded succesfully',
      data: { longURL: link.longURL },
    });
  } catch (error) {
    return next(error);
  }
}