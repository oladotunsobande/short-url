import * as env from '../config/env';

export const EVENT_PREFIX = 'short-url';

export const EXPIRED_EVENTS_CHANNEL = `__keyevent@${env.REDIS_DATABASE}__:expired`;