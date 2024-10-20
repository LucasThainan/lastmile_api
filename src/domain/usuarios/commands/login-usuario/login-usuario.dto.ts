import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString } from "class-validator"

export class LoginUsuarioDto {
  @ApiProperty({
    example: "john.doe@email.com",
    description: "Email do usuário",
    required: true
  })
  @IsEmail()
  email: string

  @ApiProperty({
    example: "john#123",
    description: "Senha do usuário",
    required: true
  })
  @IsString()
  password: string
}