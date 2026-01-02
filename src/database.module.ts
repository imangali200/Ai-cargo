import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";


@Module({
    imports:[
        TypeOrmModule.forRootAsync({
            imports:[ConfigModule],
            inject:[ConfigService],
            useFactory:(configService:ConfigService):TypeOrmModuleOptions=>{
                return{
                    type:"postgres",
                    host:configService.get<string>('DATABASE_HOST'),
                    port:parseInt(configService.get<string>('DATABASE_PORT') || '5432'),
                    password:configService.get<string>('DATABASE_PASSWORD'),
                    database:configService.get<string>('DATABASE_DATABASE'),
                    username:configService.get<string>('DATABASE_USERNAME'),
                    synchronize:false,
                    entities: [__dirname + '/**/*.entity.{js,ts}'],
                    ssl:{
                        rejectUnauthorized:false
                    },
                    autoLoadEntities: true,
                }
            }
        })
    ],
})
export class DatabaseModule {}