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
    const tokens = (await this.gc.getToken(code)).tokens;
    this.gc.setCredentials(tokens);
    const user = await this.googleOAuthService.getUserProfile();
    const existingUser = await this.userService.findOneByEmail(user.email);
    let savedUser;
    const payload = {
      email: user.email,
      emailVerified: user.verified_email,
      firstName: user.given_name,
      lastName: user.family_name || null,
      locale: user.locale,
      name: user.name,
      picture: user.picture,
    };
    if (!existingUser) {
      savedUser = await this.userService.create(payload);
    } else {
      savedUser = existingUser;
    }
    await this.userService.updateUserProfile(user.email, payload);
    await this.userService.saveUserToken(savedUser, tokens);
    return tokens;
  }

  getUser(tokens: Tokens) {
    this.gc.setCredentials(tokens);
    return this.googleOAuthService.getUserProfile({});
  }

  async logout(token) {
    const tokenInfo = await this.gc.getTokenInfo(token);
    const user = await this.userService.findOneByEmail(tokenInfo.email);
    if (user) {
      await this.userService.revokeToken(user.id);
    }
    return this.gc.revokeCredentials();
  }
}
