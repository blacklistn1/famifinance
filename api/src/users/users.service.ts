import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from '../entities/profile.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { SignUpDto } from '../common/dtos';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Profile) private profileRepo: Repository<Profile>,
  ) {}

  async create(body: SignUpDto): Promise<User> {
    const newUser = this.userRepo.create({
      email: body.email,
      password: body.password,
    });
    const user = await this.userRepo.save(newUser);
    const profile = this.profileRepo.create({
      user,
      balance: 0,
      firstName: body.firstName,
      lastName: body.lastName || null,
    });
    await this.profileRepo.save(profile);
    return user;
  }

  async findOneById(id: number) {
    return await this.userRepo.findOne({
      where: { id },
      relations: {
        profile: true,
      },
    });
  }

  async findOneByEmail(email: string) {
    return await this.userRepo.findOne({
      where: { email },
      relations: {
        profile: true,
      },
    });
  }

  async findOneBy<T>(key: T) {
    switch (typeof key) {
      case 'number':
        return await this.findOneById(key);
      default:
        return await this.findOneByEmail(key as string);
    }
  }
}
