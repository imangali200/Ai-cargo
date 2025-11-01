import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CommentDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ title: '4', description: 'post id' })
  postId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ title: 'good product', description: 'comment for the post' })
  text: string;
}
