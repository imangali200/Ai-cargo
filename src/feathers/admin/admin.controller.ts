import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/core/decorators/auth.decorators';
import { UserRoles } from 'src/core/db/enums/user.enum';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('tracks/uploads')
  @UseInterceptors(FileInterceptor('file'))
  @Auth([UserRoles.ADMIN])
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

  @Post('tracks')
  @Auth([UserRoles.ADMIN])
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        productId: { type: 'string', example: '1234' },
      },
    },
  })
  async aiCargoWareHouse(@Body("productId") productId: string) {
    return await this.adminService.inAiCargo(productId);
  }

  @Post('tracks/complete-tracks')
  @Auth([UserRoles.ADMIN])
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        productId: { type: 'string', example: '1234' },
      },
    },
  })
  async completeTracks(@Body("productId") productId: string) {
    return await this.adminService.completeTracks(productId);
  }
}
