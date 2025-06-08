import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';

@Entity({ name: 'servers' })
export class Server {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  server_id: number;

  @Column({ length: 100, nullable: false })
  name: string;

  @Index('idx_owner_id')
  @Column({ type: 'bigint', unsigned: true, nullable: false })
  owner_id: number;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
