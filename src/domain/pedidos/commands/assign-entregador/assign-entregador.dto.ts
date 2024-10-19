import { PartialType } from "@nestjs/mapped-types"
import { CreatePedidoDto } from "../create-pedido/create-pedido.dto"

export class AssignEntregadorDto extends PartialType(CreatePedidoDto) { }
