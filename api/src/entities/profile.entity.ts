import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  /* Foreign keys */

  @Column({
    nullable: true,
  })
  userId: number;

  /* Profile info */

  @Column()
  firstName: string;

  @Column({
    nullable: true,
  })
  lastName?: string;

  /**
   * User's full name
   */
  @Column()
  name: string;

  @Column()
  locale: string;

  @Column({
    nullable: true,
  })
  picture?: string;

  @Column()
  balance: number;

  /* Dates */

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  /* Relations */

  @OneToOne(() => User, (user) => user.profile, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  user: User;

  get fullName() {
    return [this.firstName, this.lastName].join(' ');
  }
}
