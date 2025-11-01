import { Module } from '@nestjs/common';
import { AuthModule } from './feathers/auth/auth.module';
import { UserModule } from './feathers/user/user.module';
import { DatabaseModule } from './database.module';
import { ConfigModule } from '@nestjs/config';
import { BranchModule } from './feathers/branch/branch.module';
import { ProductsModule } from './feathers/products/products.module';
import { AdminModule } from './feathers/admin/admin.module';
import { PostModule } from './feathers/post/post.module';
import { ProfileModule } from './feathers/profile/profile.module';


@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    BranchModule,
    ProductsModule,
    AdminModule,
    PostModule,
    ProfileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
