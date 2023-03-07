import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';

config();

@Injectable()
export class GoogleOAuthService {
  private readonly googleClient: OAuth2Client;
  constructor(private configService: ConfigService) {
    this.googleClient = new google.auth.OAuth2(
      configService.get('auth.social.google.clientID'),
      configService.get('auth.social.google.clientSecret'),
      configService.get('auth.social.google.redirectUri'),
    );
    google.options({
      auth: this.googleClient,
    });
  }

  get GoogleClient(): OAuth2Client {
    return this.googleClient;
  }

  getUserProfile(options = {}) {
    return google.oauth2('v2').userinfo.v2.me.get(options);
  }
}
