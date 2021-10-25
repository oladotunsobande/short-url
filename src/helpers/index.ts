import { randomBytes } from 'crypto';
import randomstring from 'randomstring';
import Hashids from 'hashids';

export function throwIfUndefined<T>(x: T | undefined, name?: string): T {
  if (x === undefined) {
    throw new Error(`${name} must not be undefined`);
  }
  return x;
}

export function randomizeMongoURL(url: string): string {
  return url.replace(
    /([^/]\/)([^/][a-zA-Z-_0-9]+)/,
    `$1${randomBytes(4).toString('hex')}`,
  );
}

export function generateToken(): string {
  const randomNumber = Math.floor(Math.random() * 5) + 5;

  const salt = randomstring.generate({
    charset: 'alphanumeric',
    length: 32,
  });

  const id = randomstring.generate({
    charset: 'numeric',
    length: randomNumber,
  });

  const hashids = new Hashids(salt);

  return hashids.encode(id);
}