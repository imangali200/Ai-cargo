import { Injectable, NotFoundException } from '@nestjs/common';
import { PostDto } from './dto/post_create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/core/db/entities/post.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { UserEntity } from 'src/core/db/entities/user.entity';
import { CommentDto } from './dto/comment.dto';
import { CommentsEntity } from 'src/core/db/entities/comments.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,

    @InjectRepository(CommentsEntity)
    private readonly commentRepository: Repository<CommentsEntity>,

    private readonly userService: UserService,
  ) {}

  async createPost(postDto: PostDto, id: string) {
    try {
      const user = await this.userService.findId(id);
      if (!user) throw new NotFoundException('User is not found');
      const post = await this.postRepository.create({
        ...postDto,
        author: user,
      });
      await this.postRepository.save(post);
      return { message: 'post is created successfully' };
    } catch (error) {
      return error;
    }
  }

  async addToFavorite(id: number, userId: string) {
    const post = await this.postRepository.findOne({ 
      where: { id } ,
      relations:['savedBy']
    });
    if (!post) throw new NotFoundException('Post is dont found');
    const user = await this.userService.findId(userId);
    if (!user) throw new NotFoundException('This user is not found');

    const alredySaved = post.savedBy.some(u=>u.id === user.id)
    if(alredySaved){
      post.savedBy = post.savedBy.filter(i=>i.id !== user.id)
    }else{
      post.savedBy.push(user)
    }
    return {message:'saved successfully'}
  }

  async getAllPost() {
    try {
      const posts = await this.postRepository.find({
        relations: ['comments', 'author'],
      });
      if (!posts) throw new NotFoundException('Post is not found');
      return posts;
    } catch (error) {}
  }

  async getMyPost(id:string){
    try {
      const user = await this.userService.getMyPosts(id)
      return user
    } catch (error) {
      return error
    }
  }

  async getMyLikes(userId: string) {
    const posts = await this.userService.getMyLikes(userId);
    return posts;
  }
  async addLike(id: number, userId: string) {
    try {
      const post = await this.postRepository.findOne({
        where: { id },
        relations: ['likes'],
      });
      if (!post) throw new NotFoundException('Post is dont found');
      const user = await this.userService.findId(userId);
      if (!user) throw new NotFoundException('User is not found');

      const alreadyLiked = post.likes.some((u) => u.id === user.id);
      if (alreadyLiked) {
        post.likes = post.likes.filter((u) => u.id !== user.id);
        post.likesCount -= 1;
      } else {
        post.likes.push(user);
        post.likesCount++;
      }
      await this.postRepository.save(post);
      return { message: 'liked succesfully' };
    } catch (error) {
      return error;
    }
  }

  async postComment(commentDto: CommentDto) {
    try {
      const post = await this.postRepository.findOne({
        where: { id: commentDto.postId },
      });
      if (!post) throw new NotFoundException('post is not found');
      const comment = await this.commentRepository.create({
        ...commentDto,
        post,
      });
      await this.commentRepository.save(comment);
      return { message: 'Comment created successfully' };
    } catch (error) {
      return error;
    }
  }
}
