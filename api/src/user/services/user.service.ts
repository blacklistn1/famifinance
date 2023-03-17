import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Profile, Role, Token, User } from '../../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../../common/dtos';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { Tokens } from '../../common/types';

@Injectable()
export class UserService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Profile) private profileRepo: Repository<Profile>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(Token) private tokenRepo: Repository<Token>,
  ) {}

  async onApplicationBootstrap() {
    /* Create admin(s) */

    /* Create roles */
    console.log('Inspecting roles...');
    const roles = await this.roleRepo.find({
      where: { name: In(['admin', 'user']) },
    });
    if (!roles.length) {
      console.log('Adding basic roles...');
      await this.roleRepo.insert([{ name: 'admin' }, { name: 'user' }]);
    } else {
      console.log('Already have an existing admin role. Next function...');
    }

    /* Create an admin */
    console.log('Looking for existing admin...');
    const existingAdmin = await this.userRepo.findOne({
      where: {
        email: 'ndwuong2@gmail.com',
        roleId: 1,
      },
      relations: {
        profile: true,
      },
    });
    if (!existingAdmin) {
      const admin = await this.userRepo.save(
        this.userRepo.create({
          email: 'ndwuong2@gmail.com',
          emailVerified: true,
          roleId: 1,
        }),
      );
      admin.profile = await this.profileRepo.save(
        this.profileRepo.create({
          user: admin,
          name: 'BigomG "Scarlet Pudding"',
          firstName: 'BigomG',
          locale: 'vi',
          picture:
            'https://lh3.googleusercontent.com/a/AGNmyxa-zZxmO_4xFwEERHf-Lkgk57gCfVfZXbzZYDgEmQ=s96-c',
          balance: 0,
        }),
      );
      await this.userRepo.save(admin);
      console.log('created ' + admin.profile.name + ' as admin.');
    } else {
      console.log(
        'Admin already existed: ' +
          existingAdmin.profile.name +
          ' next function...',
      );
    }
  }

  async create(payload: CreateUserDto): Promise<User> {
    const newUser = this.userRepo.create({
      email: payload.email,
      emailVerified: payload.emailVerified,
      password: payload.password || null,
      roleId: payload.roleId,
    });
    const user = await this.userRepo.save(newUser);
    const profile = this.profileRepo.create({
      user,
      balance: 0,
      firstName: payload.firstName,
      lastName: payload.lastName || null,
      locale: payload.locale || 'vi',
      name: payload.name,
      picture: payload.picture,
    });
    await this.profileRepo.save(profile);
    return user;
  }

  async updateUserProfile(email: string, payload: UpdateProfileDto) {
    const { firstName, lastName, locale, name, picture } = payload;
    const user = await this.findOneByEmail(email);
    const { profile } = user;
    profile.firstName = firstName;
    profile.lastName = lastName || null;
    profile.locale = locale;
    profile.name = name;
    profile.picture = picture;
    await this.profileRepo.save(profile);
    return this.userRepo.save(user);
  }

  findOneById(id: number): Promise<User> {
    return this.userRepo.findOne({
      where: { id },
      relations: {
        profile: true,
      },
    });
  }

  selectByQuery(query: any) {
    return this.userRepo
      .createQueryBuilder('u')
      .select('u.email', 'user_email')
      .addSelect('p.firstName')
      .execute();
  }

  saveUserToken(user: User, token: Tokens) {
    return this.tokenRepo.save(
      this.tokenRepo.create({
        userId: user.id,
        token: token.refresh_token,
      }),
    );
  }

  revokeToken(userId: number) {
    return this.tokenRepo.delete({ userId });
  }

  findOneByEmail(email: string): Promise<User> {
    return this.userRepo.findOne({
      where: { email },
      relations: {
        profile: true,
      },
    });
  }
}
