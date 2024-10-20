import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsDateString, IsNumber, IsOptional, IsString, Length, MaxLength } from "class-validator"

export class CreatePedidoDto {
  @ApiProperty({
    example: 'Pizza de Calabresa',
    description: 'Nome do pedido',
    required: true
  })
  @IsString()
  name: string

  @ApiProperty({
    example: 'Pizza de calabresa com muito queijo e muito molho de tomate',
    description: 'Descrição do pedido',
    required: true
  })
  @IsString()
  description: string

  @ApiPropertyOptional({
    example: 'Pagamento em cédula, troco para 50 reais',
    description: 'Detalhes adicionais do pedido'
  })
  @IsString()
  @IsOptional()
  comments?: string

  @ApiProperty({
    example: 'Rua das Flores',
    description: 'Endereço do pedido',
    required: true
  })
  @IsString()
  address: string

  @ApiProperty({
    example: 'São Paulo',
    description: 'Cidade do pedido',
    required: true
  })
  @IsString()
  city: string

  @ApiProperty({
    example: 'SP',
    description: 'Estado do pedido',
    required: true
  })
  @IsString()
  state: string

  @ApiProperty({
    example: '131',
    description: 'Número da residência do pedido',
    required: true,
    maxLength: 10
  })
  @IsString()
  @MaxLength(10)
  number: string

  @ApiProperty({
    example: '12345000',
    description: 'CEP do pedido',
    required: true,
    maxLength: 8
  })
  @IsString()
  @Length(8)
  postal_code: string

  @ApiProperty({
    description: "Data de criação do pedido",
    required: false
  })
  @IsDateString()
  @IsOptional()
  createdAt?: Date

  @ApiProperty({
    description: "Data de atualização do pedido",
    required: false,
    nullable: true
  })
  @IsDateString()
  @IsOptional()
  updatedAt?: Date

  @ApiProperty({
    example: 1,
    description: "Status do usuário. 0 - Cancelado, 1 - Pendente, 2 - Em Rota, 3 - Entregue",
    required: true,
    enum: [0, 1, 2, 3]
  })
  @IsNumber()
  status_pedido: number

  @ApiProperty({
    example: "7cc120dc-271b-4d2c-bb0e-e9f3aeab72d3",
    description: "Id do usuário criador do pedido",
    required: true
  })
  @IsString()
  cod_user: string

  @ApiProperty({
    examples: [null, "5f249a45-e1a2-4e52-aba3-62b21eaca02a"],
    description: "Id do entregador responsável pela entrega do pedido",
    required: false
  })
  @IsString()
  @IsOptional()
  cod_entregador?: string
}
