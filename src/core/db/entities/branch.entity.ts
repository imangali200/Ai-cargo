import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('branches')
export class BranchEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  branchName: string;

  @Column()
  responsibleName: string;

  @DeleteDateColumn({ type: 'timestamp' })
  deleteAt: Date;
}
