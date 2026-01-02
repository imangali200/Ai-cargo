import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PostDto } from './dto/post_create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/core/db/entities/post.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CommentDto } from './dto/comment.dto';
import { CommentsEntity } from 'src/core/db/entities/comments.entity';
import cloudinary from 'src/core/config/cloudinary.config';
import { ConfigService } from '@nestjs/config';
import streamifier from 'streamifier';

@Injectable()
export class PostService {

  private cloudinary = cloudinary;
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,

    @InjectRepository(CommentsEntity)
    private readonly commentRepository: Repository<CommentsEntity>,

    private readonly userService: UserService,

    private configService: ConfigService
  ) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });

  }

  async createPost(postDto: PostDto,photo:Express.Multer.File, id: number) {
    try {
      const user = await this.userService.findId(id);
      if (!user) throw new NotFoundException('User is not found');



      if(!photo){
        throw new BadRequestException("photo is required")
      }
      let imgUrl: string | undefined;
    if (photo) {
      imgUrl = await new Promise((resolve, reject) => {
        const uploadStream = this.cloudinary.uploader.upload_stream(
          { folder: 'posts' },
          (error, result) => {
            if (result) resolve(result.secure_url);
            else reject(error);
          }
        );
        streamifier.createReadStream(photo.buffer).pipe(uploadStream);
      });
    }

      const post = await this.postRepository.create({
        ...postDto,
        author: user,
        imgUrl:imgUrl
      });
      await this.postRepository.save(post);
      return { message: 'post is created successfully' };
    } catch (error) {
      throw error;
    }
  }

  async addToFavorite(id: number, userId: number) {
    try {
      const post = await this.postRepository.findOne({
        where: { id },
        relations: ['savedBy'],
      });
      if (!post) throw new NotFoundException('Post is dont found');
      const user = await this.userService.findId(userId);
      if (!user) throw new NotFoundException('This user is not found');

      const alredySaved = post.savedBy.some((u) => u.id === user.id);
      if (alredySaved) {
        post.savedBy = post.savedBy.filter((i) => i.id !== user.id);
      } else {
        post.savedBy.push(user);
      }
      await this.postRepository.save(post)
      return { message: 'saved successfully' };
    } catch (error) {
      throw error;
    }
  }

  async getAllPost() {
    try {
      const posts = await this.postRepository.find({
        relations: ['author', 'comments', 'comments.author'],
        select: {
          comments: {
            id: true,
            text: true,
            author: {
              id: true,
              name: true,
              surname: true,
            },
          },
        },
      });
      if (!posts) throw new NotFoundException('Post is not found');
      return posts;
    } catch (error) {
      throw error;
    }
  }

  async getMyPost(id: number) {
    try {
      const user = await this.userService.getMyPosts(id);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getMyLikes(userId: number) {
    const posts = await this.userService.getMyLikes(userId);
    return posts;
  }
  async addLike(id: number, userId: number) {
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
      throw error;
    }
  }

  async postComment(commentDto: CommentDto, userId: number) {
    try {
      const post = await this.postRepository.findOne({
        where: { id: commentDto.postId },
      });
      if (!post) throw new NotFoundException('post is not found');
      const authorInfo = await this.userService.findId(userId);
      if (!authorInfo) throw new NotFoundException('post is not found');

      const comment = await this.commentRepository.create({
        ...commentDto,
        author: authorInfo,
        post,
      });
      await this.commentRepository.save(comment);
      return { message: 'Comment created successfully' };
    } catch (error) {
      throw error;
    }
  }

  async searchPost(name: string) {
    try {
      const posts = await this.postRepository
        .createQueryBuilder('post')
        .where('post.review LIKE :name', { name: `%${name}%` })
        .getMany();

      if (!posts) throw new NotFoundException('posts is not found');
      return posts
    } catch (error) {
      throw error;
    }
  }


  async deleteOwnPost(userId:number,id:number){
    try {
      const post = await this.postRepository.findOne({
        where:{id},
        relations:['author']
      })

      if(!post){
        throw new NotFoundException("Post is not found")
      }

      if(post.author.id !== userId){
        throw new ForbiddenException("You can delete only your own post")
      }
      await this.postRepository.delete(id)
      return {message:"deleted successfully"}
    } catch (error) {
      throw error
    }
  }
}
