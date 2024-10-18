import { IsBoolean, IsDateString, IsEmail, IsString } from "class-validator"

export class CreateEntregadorDto {
  @IsString()
  name: string

  @IsEmail()
  email: string

  @IsString()
  password: string

  @IsString()
  phone: string

  @IsString()
  cnh: string

  @IsBoolean()
  habilitado: boolean

  @IsDateString()
  createdAt: Date

  @IsDateString()
  updatedAt: Date
}
