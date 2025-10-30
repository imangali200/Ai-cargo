import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class LoginDto{
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example:'87777777777',description:"write your phone number"})
    phoneNumber:string

    @IsString()
    @IsNotEmpty()
    @Length(5,30)
    @ApiProperty({example:'qwerty123',description:"write your password"})
    password:string
}