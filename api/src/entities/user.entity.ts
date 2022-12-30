import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Transaction } from './transaction.entity';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @Column({
    default: false,
  })
  admin: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
