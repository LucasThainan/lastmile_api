import { PartialType } from '@nestjs/mapped-types'
import { CreatePedidoDto } from '../create-pedido/create-pedido.dto'

export class UpdatePedidoDto extends PartialType(CreatePedidoDto) { }
