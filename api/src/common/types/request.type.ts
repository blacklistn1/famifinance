import { Request } from 'express';
import { User } from '../../entities';
export interface RequestWithUser extends Request {
  user: User;
}

export interface LogoutQuery {
  logout_uri?: string;
}
