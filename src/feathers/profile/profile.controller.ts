import { Controller, Get, Param, Req } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Auth } from 'src/core/decorators/auth.decorators';
import { ApiOperation } from '@nestjs/swagger';
import { UserService } from '../user/user.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService,
    private readonly userService:UserService
  ) {}

  @Get('')
  @Auth()
  @ApiOperation({summary:"get profile informations"})
  async myProfile(@Req() req:any){
    const id = req.user.id
    return await this.userService.myProfile(id)
  }

  @Get(':id')
  @Auth()
  @ApiOperation({summary:"get profile another people"})
  async getProfile(@Param("id" )id:number){
    return await this.userService.getProfile(id)
  }

  @Get('mylikes')
  @Auth()
  @ApiOperation({summary:"Get my likes"})
  async myLikes(@Req() req:any){
    const id = req.user.id
    return await this.userService.getMyLikes(id)
  }

  @Get('posts')
  @Auth()
  @ApiOperation({summary:"get my all the  posts"})
  async ownPosts(@Req() req:any){
    const id = req.user.id
    return await this.userService.getMyPosts(id)
  }

  @Get('savedProduct')
  @Auth()
  @ApiOperation({summary:'get my saved produt'})
  async mySavedProduct(@Req() req:any){
    const id = req.user.id
    return await this.userService.getMySavedProduct(id)
  }

}
