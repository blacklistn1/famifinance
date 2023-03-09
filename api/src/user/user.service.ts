import { Injectable } from '@nestjs/common';
import { InsertResult, Repository } from 'typeorm';
import { Profile, Role, User } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../common/dtos';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Profile) private profileRepo: Repository<Profile>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
  ) {}

  async create(payload: CreateUserDto): Promise<User> {
    const newUser = this.userRepo.create({
      email: payload.email,
      password: payload.password || null,
    });
    const user = await this.userRepo.save(newUser);
    const profile = this.profileRepo.create({
      user,
      balance: 0,
      firstName: payload.firstName,
      lastName: payload.lastName || null,
    });
    await this.profileRepo.save(profile);
    return user;
  }

  findOneById(id: number): Promise<User> {
    return this.userRepo.findOne({
      where: { id },
      relations: {
        profile: true,
      },
    });
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
