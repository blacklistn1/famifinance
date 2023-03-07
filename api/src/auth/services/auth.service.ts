import { Injectable } from '@nestjs/common';
import { OAuth2Client, Credentials } from 'google-auth-library';
import { UserService } from '../../user';
import { GoogleOAuthService } from './google.service';
import { Tokens } from '../../common/types';

@Injectable()
export class AuthService {
  private readonly gc: OAuth2Client;
  constructor(
    private userService: UserService,
    private readonly googleOAuthService: GoogleOAuthService,
  ) {
    this.gc = this.googleOAuthService.GoogleClient;
  }

  async login(code: string): Promise<Credentials> {
    //TODO: save user token to the db
    return (await this.gc.getToken(code)).tokens;
  }

  async getUser(tokens: Tokens) {
    this.gc.setCredentials(tokens);
    const res = await this.googleOAuthService.getUserProfile({});
    return res.data;
  }

  logout(tokens: Tokens) {
    this.gc.setCredentials(tokens);
    return this.gc.revokeCredentials();
  }
}
