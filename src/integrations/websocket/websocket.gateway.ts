import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Pedido } from 'src/domain/pedidos/entities/pedido.entity'

@WebSocketGateway({
  cors: { origin: '*' }
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private connections: any[] = []

  handleConnection(client: Socket, ...args: any[]) {
    const new_user = {
      socket_id: client.id,
      id_usuario: client.handshake.query.id_usuario,
      name: client.handshake.query.name,
      type: client.handshake.query.type,
      cod_entregador: client.handshake.query.cod_entregador,
      lat: null,
      lng: null
    }
    this.connections.push(new_user)

    if (new_user.type === '2') {
      client.join('entregadores_room')
      client.broadcast.emit('entregador_connected', { entregador: new_user })
    }
  }

  handleDisconnect(client: Socket) {
    let user = this.connections.find((v: any) => v.socket_id == client.id)

    if (user.type === '2') {
      this.server.emit('entregador_disconnected', { cod_entregador: user.cod_entregador })
    }

    delete this.connections[client.id]
  }

  pedidoCreatedNotifier(@MessageBody() pedido: Pedido) {
    // Enviar novo pedido disponível para todos os entregadores
    this.server.to('entregadores_room').emit('pedido_created', { pedido })
  }

  entregadorAssignedNotifier(@MessageBody() pedido: Pedido) {
    // Enviar para atualização de envio para o dono do pedido e os entregadores
    const response = {
      id_pedido: pedido.id_pedido,
      entregador: pedido.entregador,
      status_pedido: pedido.status_pedido
    }

    this.connections.forEach((value: any) => {
      if (value.id_usuario === pedido.cod_user) {
        this.server.to(value.socket_id).emit('pedido_entregador_updated', response)
      }
    })

    this.server.to('entregadores_room').emit('pedido_status_updated', response)
  }

  pedidoStatusNotifier(@MessageBody() pedido: Pedido) {
    // Enviar atualização de status do pedido para todos os entregadores e o dono do pedido
    const response = {
      id_pedido: pedido.id_pedido,
      status_pedido: pedido.status_pedido
    }

    if (pedido.status_pedido !== 3) {
      this.server.to('entregadores_room').emit('pedido_status_updated', response)
    } else {
      this.connections.forEach((value: any) => {
        if (value.cod_entregador === pedido.cod_entregador) {
          this.server.to(value.socket_id).emit('pedido_status_updated', response)
        }

        if (value.id_usuario === pedido.cod_user) {
          this.server.to(value.socket_id).emit('pedido_entregador_updated', response)
        }
      })
    }
  }

  @SubscribeMessage('set_location')
  setLocation(@MessageBody() payload: any) {
    let index = this.connections.findIndex(((v: any) => v.socket_id == payload.socket_id))
    if (index == -1) return

    this.connections[index].lat = String(payload.lat)
    this.connections[index].lng = String(payload.lng)

    this.server.emit('updated_location', { users: this.connections })
  }
}
