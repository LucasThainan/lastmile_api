import { ApiProperty } from "@nestjs/swagger"
import { IsString, Length } from "class-validator"

export class CreateEntregadorDto {
  @ApiProperty({
    example: "12345678901",
    description: "CNH do entregador",
    required: true
  })
  @IsString()
  @Length(11)
  cnh: string

  @ApiProperty({
    example: "ABC1234",
    description: "Placa do veículo",
    required: true
  })
  @IsString()
  @Length(7)
  placa_veiculo: string
}