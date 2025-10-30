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
                    port:configService.get<number>('DATABASE_PORT'),
                    password:configService.get<string>('DATABASE_PASSWORD'),
                    database:configService.get<string>('DATABASE_DATABASE'),
                    username:configService.get<string>('DATABASE_USERNAME'),
                    synchronize:true,
                    entities: [__dirname + '/src/core/db/entities/*.entity{.ts,.js}'],
                    autoLoadEntities: true,
                }
            }
        })
    ],
})
export class DatabaseModule {}