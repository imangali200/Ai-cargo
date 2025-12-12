import { BeforeInsert, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserRoles } from '../enums/user.enum';
import { ProductEntity } from './product.entity';
import { CommentsEntity } from './comments.entity';
import { PostEntity } from './post.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique:true})
  phoneNumber: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column({unique:true,nullable:true})
  code: string;

  @Column({default:null})
  branch:string

  @Column()
  password?: string;

  @Column({default:false})
  isActive:boolean


  @Column({type:"enum",enum:UserRoles,default:UserRoles.USER})
  role:string

  @OneToMany(()=> ProductEntity , (product)=>product.user,{onDelete:'CASCADE'})
  products:ProductEntity[]

  
  @OneToMany(()=>CommentsEntity,(comment)=>comment.author)
  comments:CommentsEntity[]

  @OneToMany(()=>PostEntity,(post)=>post.author)
  posts:PostEntity[]

  @ManyToMany(()=>PostEntity,(post)=>post.likes)
  postLikes:PostEntity[]

  @ManyToOne(()=>PostEntity,(post)=>post.savedBy)
  @JoinTable()
  saved:PostEntity[]

  @CreateDateColumn({type:'timestamp',default:()=>'CURRENT_TIMESTAMP'})
  createAt:Date

  @DeleteDateColumn()
  deletedAt:Date

  @BeforeInsert()
  SwiatchActiveAdmin(){
    this.isActive = this.role === UserRoles.ADMIN
  }
}
