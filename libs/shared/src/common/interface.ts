import { Request } from 'express';
import { ObjectId } from 'mongoose';

export interface IRequest extends Request {
  user: ObjectId;
}
