import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../user';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { GoogleOAuthService } from '../services/google.service';

@Injectable()
export class GoogleOAuthGuard implements CanActivate {
  private readonly gc: OAuth2Client;
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly googleOAuthService: GoogleOAuthService,
  ) {
    this.gc = googleOAuthService.GoogleClient;
  }

  async canActivate(context: ExecutionContext) {
    const headers = await this.gc.getRequestHeaders();
    const request = context.switchToHttp().getRequest();
    if (!headers['Authorization']) {
      throw new UnauthorizedException('Not authorized');
    }
    const token = headers['Authorization'].split(' ')[1];
    const payload = await this.gc.getTokenInfo(token);
    const user = await this.userService.findOneByEmail(payload.email);
    if (!user) {
      throw new ForbiddenException('Not allowed to view this content');
    }
    request.user = user;
    return !!user;
  }
}
