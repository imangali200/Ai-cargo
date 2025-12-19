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

  async refreshTokens(refreshToken: string) {
    try {
      // Verify the refresh token
      const payload = this.jwtService.verify(refreshToken);
      
      // Check if it's a refresh token
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      // Find the user
      const user = await this.userService.findId(payload.id);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Generate new tokens
      const tokens = await this.createTokens(user);
      return tokens;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Refresh token expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid refresh token');
      }
      throw error;
    }
  }
}
