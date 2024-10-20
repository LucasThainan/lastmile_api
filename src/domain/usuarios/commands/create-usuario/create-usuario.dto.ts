import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import {
  IsDateString,
  IsEmail,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
  ValidateNested
} from "class-validator"
import { CreateEntregadorDto } from "./create-entregador.dto"

export class CreateUsuarioDto {
  @ApiProperty({
    example: "John Doe",
    description: "Nome do usuário",
    required: true
  })
  @IsString()
  name: string

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

  @ApiProperty({
    example: "12345678901",
    description: "CPF ou CNPJ do usuário",
    required: true,
    minLength: 11,
    maxLength: 14
  })
  @IsString()
  @MinLength(11)
  @MaxLength(14)
  document: string

  @ApiProperty({
    example: "77912345678",
    description: "Telefone do usuário",
    required: true
  })
  @IsString()
  phone: string

  @ApiProperty({
    example: 2,
    description: "Tipo do usuário. 1 - Cliente, 2 - Entregador",
    required: true,
    enum: [1, 2]
  })
  @IsNumber()
  type: number

  @ApiProperty({
    example: "2023-01-01T00:00:00.000Z",
    description: "Data de criação do usuário",
    required: false
  })
  @IsDateString()
  @IsOptional()
  createdAt?: Date

  @ApiProperty({
    example: "2023-01-01T00:00:00.000Z",
    description: "Data de atualização do usuário",
    required: false,
    nullable: true
  })
  @IsDateString()
  @IsOptional()
  updatedAt?: Date

  @ApiProperty({
    example: 1,
    description: "Status do usuário",
    required: true,
    enum: [0, 1]
  })
  @IsNumber()
  status_usuario: number

  @ApiProperty({
    type: CreateEntregadorDto,
    examples: [CreateEntregadorDto, null],
    description: "Dados do entregador. Caso type seja 2",
    required: false,
    nullable: true
  })
  @ValidateIf((o) => o.type == 2)
  @IsObject()
  @ValidateNested()
  @Type(() => CreateEntregadorDto)
  entregador: CreateEntregadorDto
}
