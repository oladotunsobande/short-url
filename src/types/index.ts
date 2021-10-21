import { Types } from 'mongoose';

export interface CreateLink {
  token: string;
  longURL: string;
  validityDays: number;
}

export interface UpdateLink {
  isActive?: boolean;
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
  shortLink: string;
};