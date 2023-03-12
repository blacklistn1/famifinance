import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  /* Foreign keys */

  @Column({
    nullable: true,
  })
  userId: number;

  @Column({
    nullable: true,
  })
  categoryId: number;

  /* Transaction info */

  @Column()
  title: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column()
  amount: number;

  /* Dates */

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  /* Relations */

  @ManyToOne(() => User, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  user: User;

  @ManyToOne(() => Category, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  category: Category;
}
