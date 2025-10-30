import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ProductDto{
    @ApiProperty({title:'qwer1234',description:"you must write product is id"})
    @IsNotEmpty()
    @IsString()
    productId:string

    @ApiProperty({title:"ippone14",description:'product is name'})
    @IsNotEmpty()
    @IsString()
    productName:string
}