import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";

import { TokenService } from "../token.service";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        private readonly tokenService:TokenService,
        private readonly configService:ConfigService,
        
    ){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey:configService.getOrThrow<string>('JWT_SECRET'),
        })
    }
    async validate(payload:any){
        return this.tokenService.validate(payload)
    }
}