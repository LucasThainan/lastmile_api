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
  @IsString()
  name: string

  @IsEmail()
  email: string

  @IsString()
  password: string

  @IsString()
  @MaxLength(14)
  @MinLength(11)
  document: string

  @IsString()
  phone: string

  @IsNumber()
  type: number

  @IsDateString()
  @IsOptional()
  createdAt?: Date

  @IsDateString()
  @IsOptional()
  updatedAt?: Date

  @IsNumber()
  status_usuario: number

  @ValidateIf((o) => o.type == 2)
  @IsObject()
  @ValidateNested()
  @Type(() => CreateEntregadorDto)
  entregador: CreateEntregadorDto
}
