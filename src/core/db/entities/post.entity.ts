import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CommentsEntity } from "./comments.entity";
import { UserEntity } from "./user.entity";

@Entity('posts')
export class PostEntity{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    link:string

    @Column()
    review:string

    @Column({ nullable: true })
    imgUrl:string

    @Column('int', { default: 0 })
    likesCount:number

    @ManyToOne(()=>UserEntity , (user)=>user.posts)
    author:UserEntity

    @OneToMany(()=>CommentsEntity,(comment)=>comment.post)
    comments:CommentsEntity[]

    @ManyToMany(()=>UserEntity,(user)=>user.postLikes)
    @JoinTable()
    likes:UserEntity[]

    @OneToMany(()=>UserEntity,(user)=>user.saved)
    savedBy:UserEntity[]


    @CreateDateColumn({type:"timestamp"})
    createAt:Date

}