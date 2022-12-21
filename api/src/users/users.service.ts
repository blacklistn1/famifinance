import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(email: string, password: string): Promise<User> {
    const user = this.repo.create({ email, password });
    return await this.repo.save(user);
  }

  async findOneById(id: number) {
    return await this.repo.findOneBy({ id });
  }

  findOneByEmail(email: string) {
    return this.repo.findOneBy({ email });
  }
}
