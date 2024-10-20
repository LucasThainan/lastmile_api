import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class AssignEntregadorDto {
  @ApiProperty({
    example: "5f249a45-e1a2-4e52-aba3-62b21eaca02a",
    description: "Id do entregador responsável pela entrega do pedido",
    required: true
  })
  @IsString()
  cod_entregador: string
}
