import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Token } from './token.entity';

@Entity()
export class Scope {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  profileId: number;

  @Column({
    nullable: true,
  })
  tokenId: number;

  @Column()
  name: string;

  @ManyToOne(() => Token, (token) => token.scopes, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  token: Token;
}
