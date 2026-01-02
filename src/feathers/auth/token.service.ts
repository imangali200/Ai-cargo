import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserEntity } from 'src/core/db/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async validate(payload: any) {
    const user = await this.userService.findId(payload.id);
    if (!user) throw new NotFoundException('user not have');
    return user;
  }
  async createTokens(user: UserEntity) {
    const AccessTokenPayload = {
      phoneNumber: user.phoneNumber,
      id: user.id,
      role: user.role,
      type: 'access',
    };
    const RefreshTokenPayload = {
      phoneNumber: user.phoneNumber,
      id: user.id,
      role: user.role,
      type: 'refresh',
    };
    const accessToken = this.jwtService.sign(AccessTokenPayload, {
      expiresIn: this.configService.getOrThrow<number>('ACCESS_TOKEN_TIME'),
    });
    const refreshToken = this.jwtService.sign(RefreshTokenPayload, {
      expiresIn: this.configService.getOrThrow<number>('REFRESH_TOKEN_TIME'),
    });

    return {accessToken,refreshToken}
  }


}
