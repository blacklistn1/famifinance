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

  /* Foreign keys */

  @Column({
    nullable: true,
  })
  profileId: number;

  @Column({
    nullable: true,
  })
  roleId: number;

  /* User Info */

  @Column()
  email: string;

  @Column({
    nullable: true,
  })
  password?: string;

  @Column()
  emailVerified: boolean;

  /* Dates */

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  /* Relations */

  @OneToMany(() => Token, (token) => token.user, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  tokens: Token[];

  @OneToOne(() => Profile, (profile) => profile.user, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  profile: Profile;

  @OneToMany(() => Transaction, (transaction) => transaction.user, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  transactions: Transaction[];

  @ManyToOne(() => Role, (role) => role.users, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'roleId',
  })
  role: Role;
}
