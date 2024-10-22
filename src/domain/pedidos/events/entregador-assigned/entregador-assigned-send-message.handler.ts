import { EventsHandler, IEventHandler } from "@nestjs/cqrs"
import { EntregadorAssignedEvent } from "./entregador-assigned.event"
import { PedidosNotifierGateway } from "src/integrations/pedidos-notifier/pedidos-notifier.gateway"

@EventsHandler(EntregadorAssignedEvent)
export class EntregadorAssigned_SendMessageHandler implements IEventHandler<EntregadorAssignedEvent> {
  constructor(private readonly eventGateway: PedidosNotifierGateway) { }

  async handle(event: EntregadorAssignedEvent) {
    this.eventGateway.entregadorAssignedNotifier(event.pedido)
  }
}