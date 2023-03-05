import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
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
    const request = context.switchToHttp().getRequest();
    const token = request.get('authorization').split(' ')[1];
    request.user = { access_token: token };
    const payload = await this.gc.getTokenInfo(token);
    const user = await this.userService.findOneByEmail(payload.email);
    return !!user;
  }
}
