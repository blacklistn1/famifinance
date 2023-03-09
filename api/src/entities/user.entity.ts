import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Transaction } from './transaction.entity';
import { Role } from './role.entity';
import { Token } from './token.entity';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({
    nullable: true,
  })
  password?: string;

  @Column()
  emailVerified: boolean;

  @Column({
    nullable: true,
  })
  profileId: number;

  @Column({
    nullable: true,
  })
  roleId: number;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({
    name: 'roleId',
  })
  role: Role;
}
