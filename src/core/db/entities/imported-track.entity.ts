import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('imported_tracks')
export class ImportedTrackEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  productId: string;

  @Column({ type: 'timestamp', nullable: true })
  china_warehouse: Date;

  @Column({ type: 'timestamp', nullable: true })
  aicargo: Date;

  @Column({ type: 'timestamp', nullable: true })
  given_to_client: Date;

  // Track owner - null if no one has claimed this track yet
  @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' })
  user: UserEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

