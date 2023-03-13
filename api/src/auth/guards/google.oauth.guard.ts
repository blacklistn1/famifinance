import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
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
    let headers;
    let payload;
    try {
      headers = await this.gc.getRequestHeaders();
    } catch (e) {
      throw new UnauthorizedException('Not authorized', {
        cause: new Error(e),
      });
    }
    const request = context.switchToHttp().getRequest();
    const token = headers['Authorization'].split(' ')[1];
    try {
      payload = await this.gc.getTokenInfo(token);
    } catch (e) {
      throw new ForbiddenException();
    }
    const user = await this.userService.findOneByEmail(payload.email);
    request.user = user;
    return !!user;
  }
}
