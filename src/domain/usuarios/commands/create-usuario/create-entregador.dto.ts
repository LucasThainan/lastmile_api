import { IsString, Length } from "class-validator"

export class CreateEntregadorDto {
  @IsString()
  @Length(11)
  cnh: string

  @IsString()
  @Length(7)
  placa_veiculo: string
}