import { Body, Controller, Delete, Get, Param, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PostService } from './post.service';
import { Auth } from 'src/core/decorators/auth.decorators';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { PostDto } from './dto/post_create.dto';
import { CommentDto } from './dto/comment.dto';


import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @Auth()
  @ApiOperation({summary:"create post"})
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create post with image',
    type: PostDto, 
  })
  @UseInterceptors(FileInterceptor('photo',{
    storage: memoryStorage(),
  }))
  async createPost(@Body() postDto:PostDto ,@UploadedFile() photo:Express.Multer.File, @Req() req:any){
    console.log(photo)
    const userId = req.user.id
    return await this.postService.createPost(postDto,photo,userId)
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

  @Get('search/:name')
  @ApiOperation({summary:"post search"})
  async searchPost(@Param('name') name:string){
    return await this.postService.searchPost(name)
  }


  @Auth()
  @Delete(':id')
  @ApiOperation({summary:"delete own post"})
  async deleteOwnPost(@Param("id") id:number , @Req() req:any){
    const userId = req.user.id
    return await this.postService.deleteOwnPost(userId,id)
  }

}
