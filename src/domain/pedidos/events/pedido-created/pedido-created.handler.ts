import { EventsHandler, IEventHandler } from "@nestjs/cqrs"
import { PedidoCreatedEvent } from "./pedido-created.event"
import { PedidosNotifierGateway } from "src/integrations/pedidos-notifier/pedidos-notifier.gateway"

@EventsHandler(PedidoCreatedEvent)
export class PedidoCreatedHandler implements IEventHandler<PedidoCreatedEvent> {
  constructor(private readonly eventGateway: PedidosNotifierGateway) { }

  async handle(event: PedidoCreatedEvent) {
    this.eventGateway.pedidoCreatedNotifier(event.pedido)
  }
}