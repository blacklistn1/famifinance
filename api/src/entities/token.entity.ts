import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

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

  @Column({
    type: 'text',
    nullable: true,
  })
  idToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    onUpdate: 'current_timestamp()',
  })
  expiresAt: Date;

  @ManyToOne(() => User)
  user: User;
}
