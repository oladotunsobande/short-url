import appRootPath from 'app-root-path';
import dotenv from 'dotenv';
import { throwIfUndefined, randomizeMongoURL } from '../helpers';

dotenv.config({ path: `${appRootPath.path}/.env` });

export const NODE_ENV = throwIfUndefined(process.env.NODE_ENV, 'NODE_ENV');

export const APP_PORT = throwIfUndefined(process.env.APP_PORT, 'APP_PORT');

export const REDIS_URL = throwIfUndefined(process.env.REDIS_URL, 'REDIS_URL');

export const REDIS_DATABASE = throwIfUndefined(process.env.REDIS_DATABASE, 'REDIS_DATABASE');

export const LINK_VALIDITY_DAYS = throwIfUndefined(process.env.LINK_VALIDITY_DAYS, 'LINK_VALIDITY_DAYS');

export const SERVICE_URL = throwIfUndefined(process.env.SERVICE_URL, 'SERVICE_URL');

export const MONGO_URL =
  NODE_ENV === 'test'
    ? randomizeMongoURL(
      throwIfUndefined(process.env.MONGO_URL_TEST, 'MONGO_URL_TEST'),
    )
    : throwIfUndefined(process.env.MONGO_URL, 'MONGO_URL');
