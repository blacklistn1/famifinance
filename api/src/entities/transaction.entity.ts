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
import { Budget } from './budget.entity';

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
  budgetId?: number;

  @Column({
    nullable: true,
  })
  categoryId: number;

  /* Transaction info */

  @Column()
  title: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  /**
   * Thu hoặc chi
   */
  @Column()
  type: string;

  @Column()
  amount: number;

  @Column()
  transactionDate: Date;

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

  @ManyToOne(() => Budget, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  budget: Budget;
}
