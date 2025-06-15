import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
} from 'typeorm';
import { Server } from './Server';
import { User } from './User';

@Entity({ name: 'server_members' })
export class ServerMember {
  //primary key
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  server_member_id: number;

  //foreign key user_id
  @Index('idx_server_members_user_id')
  @Column({ type: 'bigint', unsigned: true, nullable: false })
  user_id: number;

  //foreign key server_id
  @Index('idx_server_members_server_id')
  @Column({ type: 'bigint', unsigned: true, nullable: false })
  server_id: number;

  //foreign key server_id
  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  //foreign key server_id
  @ManyToOne(() => Server, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'server_id' })
  server: Server;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
