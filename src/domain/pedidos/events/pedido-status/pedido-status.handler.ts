import { EventsHandler, IEventHandler } from "@nestjs/cqrs"
import { PedidoStatusEvent } from "./pedido-status.event"
import { WebsocketGateway } from "src/integrations/websocket/websocket.gateway"

@EventsHandler(PedidoStatusEvent)
export class PedidoStatusHandler implements IEventHandler<PedidoStatusEvent> {
  constructor(private readonly eventGateway: WebsocketGateway) { }

  async handle(event: PedidoStatusEvent) {
    this.eventGateway.pedidoStatusNotifier(event.pedido)
  }
}