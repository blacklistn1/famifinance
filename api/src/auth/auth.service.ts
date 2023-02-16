import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignInDto, SignUpDto } from '../common/dtos';
import { encryptionOptions } from '../common/constants';
import { JwtService } from '../jwt';
import { Tokens } from '../common/types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Sign up new user and sign new tokens
   * @param  {SignUpDto} payload
   * @return {Promise<Tokens>}
   */
  async signUp(payload: SignUpDto): Promise<Tokens> {
    const { email, password } = payload;
    const user = await this.usersService.findOneByEmail(email);
    if (user) throw new BadRequestException('User already exists');
    const encPassword = await bcrypt.hash(
      password,
      encryptionOptions.saltRounds,
    );
    const newUser = await this.usersService.create({
      email,
      password: encPassword,
      firstName: payload.firstName,
      lastName: payload.lastName || null,
    });
    return this.jwtService.signToken({
      id: newUser.id,
      email: newUser.email,
    });
  }

  /**
   * login using jwt
   * @param {SignInDto} payload
   * @return {Promise<Tokens>}
   */
  async signIn(payload: SignInDto) {
    const { email, password } = payload;
    const user = await this.usersService.findOneByEmail(email);
    const compareResult = await bcrypt.compare(password, user.password);
    if (!compareResult) throw new BadRequestException('Incorrect password');
    return this.jwtService.signToken({
      id: user.id,
      email,
    });
  }

  async refreshToken() {
    //TODO: Refresh token function
    //Check for a valid token
    //If no, return error (or logout? Need check)
    //If yes, search for a valid registered token in the database
  }
}
