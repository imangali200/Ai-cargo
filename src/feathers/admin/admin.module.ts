import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/core/db/entities/product.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports:[TypeOrmModule.forFeature([ProductEntity]),UserModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
