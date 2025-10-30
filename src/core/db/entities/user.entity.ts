import { BeforeInsert, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserRoles } from '../enums/user.enum';
import { ProductEntity } from './product.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({unique:true})
  phoneNumber: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column({unique:true})
  code: string;

  @Column({default:null})
  branch:string

  @Column()
  password: string;

  @Column({default:false})
  isActive:boolean


  @Column({type:"enum",enum:UserRoles,default:UserRoles.USER})
  role:string

  @OneToMany(()=> ProductEntity , (product)=>product.user)
  products:ProductEntity[]

  @CreateDateColumn({type:'timestamp',default:()=>'CURRENT_TIMESTAMP'})
  createAt:Date

  @DeleteDateColumn()
  deletedAt:Date

  @BeforeInsert()
  SwiatchActiveAdmin(){
    this.isActive = this.role === UserRoles.ADMIN
  }
}
