import { Injectable } from '@nestjs/common';
import { UserService } from '../user';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService) {}

  async signUp() {}

  async signIn() {}

  refreshToken() {}

  signOut() {}
}
