import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BranchService } from './branch.service';
import { Auth } from 'src/core/decorators/auth.decorators';
import { UserRoles } from 'src/core/db/enums/user.enum';
import { BranchesDto } from './dto/branches.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Get()
  @ApiOperation({summary:'get all the branches'})
  async getBranch() {
    return await this.branchService.getBranches();
  }

  @Auth([UserRoles.SUPERADMIN])
  @Post('')
  @ApiOperation({summary:'create branches'})
  async branchCreate(@Body() branchesDto: BranchesDto) {
    return await this.branchService.createBranch(branchesDto);
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        branchName: { type: 'string', description: 'tarax' },
        responsibleName: { type: 'string', description: 'imangali' },
      },
    },
  })
  @Auth([UserRoles.SUPERADMIN])
  @Put('id')
  @ApiOperation({summary:'update branches'})
  async updateBranch(
    @Body() branchesDto: Partial<BranchesDto>,
    @Param('id') id: number,
  ) {
    return await this.branchService.updateBranch(branchesDto, id);
  }

  @Auth([UserRoles.SUPERADMIN])
  @Get('trash')
  @ApiOperation({summary:'get trash branches'})
  async trachBranches(){
    return await this.branchService.trachBranches()
  }

  @Auth([UserRoles.SUPERADMIN])
  @Delete(':id')
  @ApiOperation({summary:'delete branch'})
  async deleteBranch(@Param('id') id: number) {
    return await this.branchService.deleteBranch(id);
  }
}
