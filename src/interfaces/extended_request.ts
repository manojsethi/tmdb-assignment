import { Request } from 'express';
import { IUser } from './user';

export default interface ExtendedRequest extends Request {
  user: IUser;
}
