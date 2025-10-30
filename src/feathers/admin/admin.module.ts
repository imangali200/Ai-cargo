import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/core/db/entities/product.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ProductEntity])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
