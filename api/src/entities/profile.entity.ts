import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @OneToOne(() => User)
  user: User;

  @Column()
  firstName: string;

  @Column({
    nullable: true,
  })
  lastName: string;

  @Column()
  balance: number;
}
