import { PartialType } from '@nestjs/swagger'
import { CreatePedidoDto } from '../create-pedido/create-pedido.dto'

export class UpdatePedidoDto extends PartialType(CreatePedidoDto) { }
