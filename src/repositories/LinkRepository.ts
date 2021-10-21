import { Types } from 'mongoose';
import { Link } from '../models';
import { ILink } from '../models/link';
import {
  CreateLink,
  UpdateLink,
  LinkQueryParameters,
} from '../types';

class LinkRepository {
  public async create({
    token,
    longURL,
    validityDays,
  }: CreateLink): Promise<ILink> {
    const link = new Link({ 
      token,
      longURL,
      validityDays,
    });
    return link.save();
  }

  public async update(linkId: Types.ObjectId, record: UpdateLink) {
    return Link.findOneAndUpdate(
      { _id: linkId },
      { $set: record },
      { new: true },
    );
  }

  public async getOne(linkId: Types.ObjectId): Promise<ILink> {
    return Link.findById(linkId).lean(true);
  }

  public async getOneBy(query: LinkQueryParameters): Promise<ILink> {
    return Link.findOne(query).lean(true);
  }
}

export default new LinkRepository();