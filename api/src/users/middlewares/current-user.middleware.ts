import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from '../../entities/user.entity';
import { UsersService } from '../users.service';

interface RequestWithCurrentUser extends Request {
  userId?: number;

  currentUser?: User;
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}
  async use(req: RequestWithCurrentUser, res: Response, next: NextFunction) {
    const { userId } = <RequestWithCurrentUser>(req.session || {});
    if (userId) {
      req.currentUser = await this.usersService.findOneById(userId);
    }
    next();
  }
}
