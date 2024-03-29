import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Profile } from './profile.entity';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  userId: number;

  @Column()
  title: string;

  @Column({
    nullable: true,
  })
  description?: string;

  @Column()
  salary: number;

  @Column({
    nullable: true,
  })
  payDay?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Profile, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  profile: Profile;
}
