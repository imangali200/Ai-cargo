import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UserRoles } from 'src/core/db/enums/user.enum';

export class CreateUser {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({example:"87777777777",description:"write your phoneNumber"})
  phoneNumber: string;

  @IsString()
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
  @ApiProperty({example:"user",description:"write user is role"})
  role: string;

  @IsString()
  @ApiProperty({example:"taraz",description:"write your branch"})
  branch:string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({example:"qwerty123",description:"write your password"})
  password: string;
}
