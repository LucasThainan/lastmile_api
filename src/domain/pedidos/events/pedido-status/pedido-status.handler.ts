import { EventsHandler, IEventHandler } from "@nestjs/cqrs"
import { PedidoStatusEvent } from "./pedido-status.event"
import { PedidosNotifierGateway } from "src/integrations/pedidos-notifier/pedidos-notifier.gateway"

@EventsHandler(PedidoStatusEvent)
export class PedidoStatusHandler implements IEventHandler<PedidoStatusEvent> {
  constructor(private readonly eventGateway: PedidosNotifierGateway) { }

  async handle(event: PedidoStatusEvent) {
    this.eventGateway.pedidoStatusNotifier(event.pedido)
  }
}