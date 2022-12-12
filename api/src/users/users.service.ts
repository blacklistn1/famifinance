import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async find(): Promise<User[]> {
    return await this.repository.find();
  }

  async findOneByEmail(email: string): Promise<User> {
    if (!email) {
      throw new BadRequestException('Invalid email');
    }
    return await this.repository.findOneBy({ email });
  }

  async findOneById(id: number): Promise<User> {
    if (!id) {
      throw new BadRequestException('Invalid id');
    }
    return await this.repository.findOneBy({ id });
  }

  async create(email: string, password: string): Promise<User> {
    const user = this.repository.create({ email, password });
    return await this.repository.save(user);
  }
}
