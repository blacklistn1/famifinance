import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['email'])
export class Jwt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  token: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    onUpdate: 'current_timestamp()',
  })
  expiresAt: Date;
}
