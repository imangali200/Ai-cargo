import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/core/decorators/auth.decorators';
import { UserRoles } from 'src/core/db/enums/user.enum';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { CreateUser } from './dto/createUser.dto';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ summary: 'create user by admin' })
  @Post('/createuser')
  @Auth([UserRoles.SUPERADMIN])
  async createUser(@Body() createUser: CreateUser) {
    return await this.userService.createByAdmin(createUser);
  }
  
  @ApiOperation({summary:'import file showed in china branch'})
  @Post('tracks/uploads')
  @UseInterceptors(FileInterceptor('file'))
  @Auth([UserRoles.ADMIN,UserRoles.SUPERADMIN])
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        time: { type: 'string', example: '2025-10-28 16:00' },
      },
    },
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('time') time: string,
  ) {
    return await this.adminService.updateExcelFile(file, time);
  }


  @ApiOperation({summary:'import file showed in aicargo'})
  @Post('tracks/uploads-taraz')
  @UseInterceptors(FileInterceptor('file'))
  @Auth([UserRoles.ADMIN,UserRoles.SUPERADMIN])
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        time: { type: 'string', example: '2025-10-28 16:00' },
      },
    },
  })
  async uploadFileTaraz(
    @UploadedFile() file: Express.Multer.File,
    @Body('time') time: string,
  ) {
    return await this.adminService.updateTarazExcelFile(file, time);
  }


  @Post('tracks')
  @Auth([UserRoles.ADMIN,UserRoles.SUPERADMIN])
  @ApiOperation({summary:"in the branch"})
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        productId: { type: 'string', example: '1234' },
      },
    },
  })
  async aiCargoWareHouse(@Body('productId') productId: string) {
    return await this.adminService.inAiCargo(productId);
  }

  @Post('tracks/complete-tracks')
  @Auth([UserRoles.ADMIN,UserRoles.SUPERADMIN])
  @ApiOperation({summary:"Complete track"})
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        productId: { type: 'string', example: '1234' },
      },
    },
  })
  async completeTracks(@Body('productId') productId: string) {
    return await this.adminService.completeTracks(productId);
  }

  @ApiOperation({ summary: 'get all the users' })
  @Get()
  @Auth([UserRoles.ADMIN, UserRoles.SUPERADMIN])
  async getUsers() {
    return await this.userService.findUsers();
  }
  @ApiOperation({ summary: 'get users from archive' })
  @Get('archive')
  @Auth([UserRoles.ADMIN, UserRoles.SUPERADMIN])
  async archiveUsers() {
    return await this.userService.getArchiveUsers();
  }

  @ApiOperation({ summary: 'Get all imported tracks' })
  @Get('imported-tracks')
  @Auth([UserRoles.ADMIN, UserRoles.SUPERADMIN])
  async getAllImportedTracks() {
    return await this.adminService.getAllImportedTracks();
  }

  @ApiOperation({ summary: 'Search imported tracks by productId' })
  @Get('imported-tracks/search')
  @Auth([UserRoles.ADMIN, UserRoles.SUPERADMIN])
  async searchImportedTracks(@Query('productId') productId: string) {
    return await this.adminService.searchImportedTrack(productId);
  }
}
