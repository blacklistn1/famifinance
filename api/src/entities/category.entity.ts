import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(() => Transaction, (t) => t.category)
  transactions: Transaction[];
}
