import { Types } from 'mongoose';
import redis from 'redis';
import * as env from '../config/env';
import { redisAsync } from '../util/redis';
import { ENVS } from '../constants';
import { LinkType } from '../types';
import {
  EVENT_PREFIX,
  EXPIRED_EVENTS_CHANNEL
} from '../constants/redis';
import { logger } from '../util/logger';
import LinkRepository from '../repositories/LinkRepository';

const url = `${env.REDIS_URL}/${env.REDIS_DATABASE}`;

class UrlCacheService {
  private client: redis.RedisClient;
  private sub: redis.RedisClient;

  constructor() {
    this.client = redis.createClient(url);

    if (env.NODE_ENV === ENVS.DEV) {
      // Set keyspace notification config
      this.client.on('ready', () => {
        logger.info('Redis connection is READY');
        this.client.config("SET", "notify-keyspace-events", "Ex");
      });
    }

    // Set redis subscriber
    this.sub = redis.createClient(url);
    this.sub.setMaxListeners(0);
  }

  async setURLInCache (
    longURL: string,
    token: string, 
    linkId: Types.ObjectId,
    shortLink: string,
  ) {
    const expirySeconds = parseInt(env.LINK_VALIDITY_DAYS) * 24 * 60 * 60;

    const payload = JSON.stringify({
      linkId,
      token,
      shortLink,
    });

    const urlBase64 = Buffer.from(longURL).toString('base64');
    
    return this.client
      .multi()
      .set(token, urlBase64)
      .set(urlBase64, payload)
      .set(`${EVENT_PREFIX}:${urlBase64}`, String(linkId))
      .expire(`${EVENT_PREFIX}:${urlBase64}`, expirySeconds)
      .exec();
  }

  urlExpiryInCacheListener() {
    this.sub.on('message', async (channel: string, message: string) => {
      if (channel === EXPIRED_EVENTS_CHANNEL) {
        const [prefix, urlBase64] = message.split(':');
  
        if (prefix === EVENT_PREFIX) {
          const value: string | null = await redisAsync.get(urlBase64);
          if (value) {
            const { linkId, token, shortLink }: LinkType = JSON.parse(value);

            const linkRecord = await LinkRepository.getOne(linkId);
            if (!linkRecord) {
              logger.error('Link record not found');
              return;
            }

            await LinkRepository.update(
              linkId,
              {
                isActive: false,
                expiredAt: new Date(),
              },
            );

            logger.info(`[LINK CACHE] - Short link (${shortLink}) expired at ${new Date().toISOString()}`);
            await redisAsync.del(urlBase64);
            await redisAsync.del(token);
          }
        }
      }
    });
    
    this.sub.subscribe(EXPIRED_EVENTS_CHANNEL);
  }
}

export default UrlCacheService;