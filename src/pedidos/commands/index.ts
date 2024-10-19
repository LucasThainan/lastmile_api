import { AssignEntregadorHandler } from "./assign-entregador/assign-entregador.handler"
import { CreatePedidoHandler } from "./create-pedido/create-pedido.handler"
import { UpdatePedidoHandler } from "./update-pedido/update-pedido.handler"

export const CommandHandlers = [CreatePedidoHandler, UpdatePedidoHandler, AssignEntregadorHandler]