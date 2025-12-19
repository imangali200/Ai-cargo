import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

