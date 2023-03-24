import { User } from './user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BudgetCategory } from './budget-category.entity';
import { Transaction } from './transaction.entity';

@Entity()
export class Budget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  categoryId: number;

  @Column({
    nullable: true,
  })
  userId: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column('varchar', {
    length: 50,
    comment: 'Loại giao dịch như theo tháng, theo năm, theo dự án, ...',
  })
  type: string;

  @Column()
  name: string;

  @Column({
    nullable: true,
  })
  description?: string;

  @Column()
  amount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => BudgetCategory, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  category: BudgetCategory;

  @OneToMany(() => Transaction, (t) => t.budget)
  transactions: Transaction[];
}
