import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Scope } from './scope.entity';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  userId: number;

  @Column()
  token: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  expiryDate: number;

  @ManyToOne(() => User, (user) => user.tokens, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  user: User;

  @OneToMany(() => Scope, (scope) => scope.token, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  scopes: Scope[];
}
