import { Injectable } from '@nestjs/common';
import { UserService } from '../../user';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { GoogleOAuthService } from './google.service';
import { Tokens } from '../../common/types';
import { google } from 'googleapis';

@Injectable()
export class AuthService {
  private readonly gc: OAuth2Client;
  constructor(
    private usersService: UserService,
    private readonly configService: ConfigService,
    private readonly googleOAuthService: GoogleOAuthService,
  ) {
    this.gc = this.googleOAuthService.GoogleClient;
  }

  async login(code: string) {
    return (await this.gc.getToken(code)).tokens;
  }

  refreshToken() {
    this.gc.on('tokens', (tokens) => {
      if (tokens.access_token) {
        this.gc.setCredentials(tokens);
        return { accessToken: tokens.access_token };
      }
    });
  }

  async getUser(tokens: Tokens) {
    this.gc.setCredentials(tokens);
    const res = await this.googleOAuthService.getUserProfile({});
    return res.data;
  }

  logout() {
    return this.gc.revokeCredentials();
  }
}
