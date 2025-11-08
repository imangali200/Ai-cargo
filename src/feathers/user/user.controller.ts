import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/core/decorators/auth.decorators';
import { UserRoles } from 'src/core/db/enums/user.enum';
import { CreateUser } from '../admin/dto/createUser.dto';
import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import { RegisterDto } from '../auth/dto/register.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @ApiOperation({summary:"get admins for the branches"})
  @Auth([UserRoles.SUPERADMIN])
  @Get('admins')
  async getAdmins(){
    return await this.userService.getAdmins()
  }

  @ApiOperation({ summary: 'search with (name,phonenumber,surname,role)' })
  @Get(':search')
  @Auth([UserRoles.ADMIN, UserRoles.SUPERADMIN])
  async searchUsers(@Query('search') search: number) {
    return await this.userService.searchUsers(search);
  }

  @ApiOperation({ summary: 'update user' })
  @Put(':id')
  @Auth([UserRoles.ADMIN, UserRoles.SUPERADMIN])
  async updateUser(@Param('id') id: number, @Body() updateData: RegisterDto) {
    return await this.userService.updateUser(id, updateData);
  }

  @ApiOperation({summary:'switch the active'})
  @Put('active/:id')
  @Auth([UserRoles.SUPERADMIN])
  async switchActive(@Param('id') id:number){
    return await this.userService.switchActive(id)
  }

  @ApiOperation({ summary: 'remove from archive' })
  @Patch('archive/:id')
  @Auth([UserRoles.ADMIN, UserRoles.SUPERADMIN])
  async switchToNoArchive(@Param('id') id: string) {
    return await this.userService.restoreUser(id);
  }

  @ApiOperation({ summary: 'delete user to archive' })
  @Delete(':id')
  @Auth([UserRoles.ADMIN, UserRoles.SUPERADMIN])
  async deleteUser(@Param('id') id: number) {
    return await this.userService.deleteUser(id);
  }

  @ApiOperation({ summary: 'delete user in database' })
  @Delete('/archive/:id')
  @Auth([UserRoles.ADMIN, UserRoles.SUPERADMIN])
  async deleteArchiveUser(@Param('id') id: string) {
    return await this.userService.deleteArchiveUser(id);
  }
}
