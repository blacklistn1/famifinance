import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BudgetCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
