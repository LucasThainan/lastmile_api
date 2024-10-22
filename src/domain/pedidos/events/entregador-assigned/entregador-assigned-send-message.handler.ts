import { EventsHandler, IEventHandler } from "@nestjs/cqrs"
import { EntregadorAssignedEvent } from "./entregador-assigned.event"
import { WebsocketGateway } from "src/integrations/websocket/websocket.gateway"

@EventsHandler(EntregadorAssignedEvent)
export class EntregadorAssigned_SendMessageHandler implements IEventHandler<EntregadorAssignedEvent> {
  constructor(private readonly eventGateway: WebsocketGateway) { }

  async handle(event: EntregadorAssignedEvent) {
    this.eventGateway.entregadorAssignedNotifier(event.pedido)
  }
}