import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Category } from '../categories/category.entity';

export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  @ManyToOne(() => User, (user) => user.transactions)
  user: User;

  @Column()
  @ManyToOne(() => Category)
  category: Category;
}
