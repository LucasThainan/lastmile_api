export class CreatePedidoCommand {
  name: string
  description: string
  comments?: string
  address: string
  city: string
  state: string
  number: string
  postal_code: string
  createdAt: string
  status_pedido: number
  cod_user: string
}