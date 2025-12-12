import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { Auth } from 'src/core/decorators/auth.decorators';
import { ApiOperation } from '@nestjs/swagger';
import { PostDto } from './dto/post_create.dto';
import { CommentDto } from './dto/comment.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @Auth()
  @ApiOperation({summary:"create post"})
  async createPost(@Body() postDto:PostDto , @Req() req:any){
    const userId = req.user.id
    return await this.postService.createPost(postDto,userId)
  }

  @Post('comment')
  @Auth()
  @ApiOperation({summary:"write a comment for the post"})
  async postComment(@Body() commentDto:CommentDto , @Req() req:any ){
    const userId = req.user.id
    return await this.postService.postComment(commentDto,userId)
  }

    @Post('save/:id')
  @Auth()
  @ApiOperation({summary:'add to favorites'})
  async addFavorite(@Param('id') id:number , @Req() req:any){
    const userId = req.user.id
    return await this.postService.addToFavorite(id,userId)
  }


  @Get()
  @Auth()
  @ApiOperation({summary:"get all the post"})
  async getAllPost(){
    return await this.postService.getAllPost()
  }

  @Get('likes/:id')
  @Auth()
  @ApiOperation({summary:'like is function'})
  async like(@Param('id') id:number,@Req() req:any){
    const userId = req.user.id
    return await this.postService.addLike(id,userId)
  }

}
