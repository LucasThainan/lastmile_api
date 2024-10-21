import { PedidoDto } from "../get-pedido/pedido.dto"

export class GetPedidosDto {
  pedidos: PedidoDto[]
  total: number
}