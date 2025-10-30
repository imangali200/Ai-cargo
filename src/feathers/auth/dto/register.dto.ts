import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({example:"87777777777",description:"write your phoneNumber"})
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({example:"1234",description:"write your code"})
  code: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({example:"imangali",description:"write your name"})
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({example:"zhaksylyk",description:"write your surname"})
  surname: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({example:"taraz",description:"write your branch"})
  branch:string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({example:"qwerty123",description:"write your password"})
  password: string;
}
