import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class ReactCreateDto {
  @ApiProperty({
    example: "3sdf3",
    description: "the react of the thread"
  })
  @IsNotEmpty()
  @IsString()
  readonly react: string
}
