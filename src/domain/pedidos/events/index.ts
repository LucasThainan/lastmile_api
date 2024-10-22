import { EntregadorAssigned_SendMessageHandler } from "./entregador-assigned/entregador-assigned-send-message.handler"
import { PedidoCreatedHandler } from "./pedido-created/pedido-created.handler"
import { PedidoStatusHandler } from "./pedido-status/pedido-status.handler"

export const EventHandlers = [EntregadorAssigned_SendMessageHandler, PedidoCreatedHandler, PedidoStatusHandler]