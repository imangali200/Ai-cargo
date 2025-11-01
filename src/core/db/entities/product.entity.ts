import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: string;

  @Column()
  productName: string;

  @ManyToOne(()=>UserEntity,(user)=> user.products,{onDelete:"CASCADE"})
  user:UserEntity

  @CreateDateColumn({ type: 'timestamp' })
  client_registered: Date;

  @Column({ type: 'timestamp', nullable: true })
  china_warehouse: Date;

  @Column({ type: 'timestamp', nullable: true })
  aicargo: Date;

  @Column({ type: 'timestamp', nullable: true })
  given_to_client: Date;

  @DeleteDateColumn({type:"timestamp"})
  deleteAt:Date
}
