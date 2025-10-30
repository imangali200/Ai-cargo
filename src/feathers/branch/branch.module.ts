import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchEntity } from 'src/core/db/entities/branch.entity';
import { UserEntity } from 'src/core/db/entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([BranchEntity,UserEntity])],
  controllers: [BranchController],
  providers: [BranchService],
})
export class BranchModule {}
