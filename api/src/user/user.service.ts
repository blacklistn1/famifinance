import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Profile, User } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto } from '../common/dtos';

@Injectable()
export class UserService {
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
