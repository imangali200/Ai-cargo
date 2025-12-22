import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PostDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ title: 'http://', description: 'link of the product' })
  link: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    title: 'it is very good product',
    description: 'review for your product',
  })
  review: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  photo: any;
}
