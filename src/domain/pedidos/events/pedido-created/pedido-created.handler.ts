import { EventsHandler, IEventHandler } from "@nestjs/cqrs"
import { PedidoCreatedEvent } from "./pedido-created.event"
import { WebsocketGateway } from "src/integrations/websocket/websocket.gateway"

@EventsHandler(PedidoCreatedEvent)
export class PedidoCreatedHandler implements IEventHandler<PedidoCreatedEvent> {
  constructor(private readonly eventGateway: WebsocketGateway) { }

  async handle(event: PedidoCreatedEvent) {
    this.eventGateway.pedidoCreatedNotifier(event.pedido)
  }
}