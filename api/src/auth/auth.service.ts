import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignInDto } from '../users/dtos/sign-in.dto';
import { encryptPassword } from '../common/helper';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { JwtService } from './jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private nestJwtService: NestJwtService,
    private jwtService: JwtService,
  ) {}

  async validateUser(credentials: SignInDto) {
    const user = await this.usersService.findOneByEmail(credentials.email);
    if (!user) return null;
    const [salt, storedPassword] = user.password.split('.');
    const encPassword = await encryptPassword(credentials.password, salt, 32);
    if (encPassword.toString('hex') !== storedPassword) {
      return null;
    }
    const { password, ...rest } = user;
    return rest;
  }

  /**
   * login using jwt
   * @param body
   * @return {{accessToken: string}}
   */
  async login(body: any) {
    //extract email from the req body
    const { id, email } = body;
    //Find the token in the registered tokens
    const { token } = await this.jwtService.findOne(email);
    //If exists, return the token
    if (token) return { accessToken: token };
    //If not, register a new one then return
    else {
      const newToken = this.jwtService.sign({ id, email });
      return {
        accessToken: newToken,
      };
    }
    // const token = await this.jwtService.findOne(email);
  }

  async refreshToken() {
    //TODO: Refresh token function
    //Check for a valid token
    //If no, return error (or logout? Need check)
    //If yes, search for a valid registered token in the database
  }
}
