import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class BranchesDto{
    @ApiProperty({title:"branchName", description:'write new branch name for example Склад Тараз'})
    @IsString()
    @IsNotEmpty()
    branchName:string

    @ApiProperty({title:"admin name", description:"response admin name"  })
    @IsString()
    @IsNotEmpty()
    responsibleName:string
}