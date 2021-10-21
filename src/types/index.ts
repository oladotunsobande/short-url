import { Types } from 'mongoose';
import { Response } from 'express';

export type ResponseType = Response | void;

export interface CreateLink {
  token: string;
  longURL: string;
  validityDays: number;
}

export interface UpdateLink {
  isActive?: boolean;
  validityDays?: number;
  expiredAt?: Date;
}

export type LinkQueryParameters = {
  _id?: Types.ObjectId;
  token?: string;
  longURL?: string;
  isActive?: boolean;
};

export type LinkType = {
  linkId: Types.ObjectId;
  token: string;
  shortLink: string;
};