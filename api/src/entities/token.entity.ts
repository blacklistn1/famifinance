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

  /* Foreign keys */

  @Column({
    nullable: true,
  })
  userId: number;

  /* Token info */

  @Column()
  token: string;

  @CreateDateColumn()
  createdAt: Date;

  /* Relations */

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
