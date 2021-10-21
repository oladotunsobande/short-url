import mongoose from 'mongoose';

import { db } from '../util/mongo';
import { ILink, LinkSchema } from './link';

export const Link = db.model<ILink>('Link', LinkSchema);