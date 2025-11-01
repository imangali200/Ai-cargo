import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from 'src/core/db/entities/post.entity';
import { UserService } from '../user/user.service';
import { UserEntity } from 'src/core/db/entities/user.entity';
import { UserModule } from '../user/user.module';
import { CommentsEntity } from 'src/core/db/entities/comments.entity';

@Module({
  imports:[TypeOrmModule.forFeature([PostEntity,UserEntity,CommentsEntity]),UserModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
