import { Pedido } from "../../entities/pedido.entity"

export class PedidoCreatedEvent {
  constructor(public readonly pedido: Pedido) {}
}