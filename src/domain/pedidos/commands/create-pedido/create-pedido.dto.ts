import { IsDateString, IsNumber, IsOptional, IsString, Length, MaxLength } from "class-validator"

export class CreatePedidoDto {
  @IsString()
  name: string

  @IsString()
  description: string

  @IsString()
  @IsOptional()
  comments?: string

  @IsString()
  address: string

  @IsString()
  city: string

  @IsString()
  state: string

  @IsString()
  @MaxLength(10)
  number: string

  @IsString()
  @Length(8)
  postal_code: string

  @IsDateString()
  @IsOptional()
  createdAt?: Date

  @IsDateString()
  @IsOptional()
  updatedAt?: Date

  @IsNumber()
  status_pedido: number

  @IsString()
  cod_user: string

  @IsString()
  @IsOptional()
  cod_entregador?: string
}
