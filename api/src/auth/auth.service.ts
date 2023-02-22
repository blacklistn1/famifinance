import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users';
import { SignInDto, SignUpDto } from '../common/dtos';
import { ENCRYPTION_OPTIONS } from '../common/constants';
import { JwtService } from '../jwt';
import { JwtPayload, Tokens } from '../common/types';
import { DeleteResult } from 'typeorm';

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
      ENCRYPTION_OPTIONS.SALT_ROUNDS,
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

  refreshToken(payload: JwtPayload): Promise<Tokens> {
    return this.jwtService.refreshToken(payload);
  }

  signOut(user: JwtPayload & Tokens): Promise<DeleteResult> {
    return this.jwtService.removeToken(user.refreshToken);
  }
}
