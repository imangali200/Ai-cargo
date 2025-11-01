import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { PostEntity } from "./post.entity";

@Entity('comments')
export class CommentsEntity{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    text:string

    @ManyToOne(()=>UserEntity,(user)=>user.comments)
    author:UserEntity

    @ManyToOne(()=>PostEntity,(post)=>post.comments)
    post:PostEntity
}