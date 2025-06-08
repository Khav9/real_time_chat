import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  user_id: number;

  @Index('idx_username')
  @Column({ length: 50, unique: true, nullable: false })
  username: string;

  @Index('idx_email')
  @Column({ length: 255, unique: true, nullable: false })
  email: string;

  @Column({ length: 255, name: 'password_hash', nullable: false })
  password_hash: string;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updated_at: Date;
}
