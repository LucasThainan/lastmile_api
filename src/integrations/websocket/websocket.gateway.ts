import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Pedido } from 'src/domain/pedidos/entities/pedido.entity'

@WebSocketGateway({
  cors: { origin: '*' }
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private connections = {}

  handleConnection(client: Socket, ...args: any[]) {
    const new_user = {
      id_usuario: client.handshake.query.id_usuario,
      name: client.handshake.query.name,
      type: client.handshake.query.type,
      cod_entregador: client.handshake.query.cod_entregador,
      lat: null,
      lng: null
    }
    this.connections = { ...this.connections, [client.id]: new_user }

    if (new_user.type === '2') {
      client.join('entregadores_room')
      client.broadcast.emit('entregador_connected', { entregador: new_user })
    }
  }

  handleDisconnect(client: Socket) {
    let user = this.connections[client.id]

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

    Object.keys(this.connections).forEach(key => {
      if (this.connections[key].id_usuario === pedido.cod_user) {
        this.server.to(key).emit('pedido_status_updated', response)
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
      Object.keys(this.connections).forEach(key => {
        if (this.connections[key].cod_entregador === pedido.cod_entregador) {
          this.server.to(key).emit('pedido_status_updated', response)
        }

        if (this.connections[key].id_usuario === pedido.cod_user) {
          this.server.to(key).emit('pedido_status_updated', response)
        }
      })
    }
  }

  @SubscribeMessage('set_location')
  setLocation(@MessageBody() payload: any) {
    let connection = this.connections[payload.socket_id]
    if (!connection) return

    this.connections[payload.socket_id].lat = payload.lat
    this.connections[payload.socket_id].lng = payload.lng

    const response = {
      id_usuario: connection.id_usuario,
      name: connection.name,
      type: connection.type,
      cod_entregador: connection.cod_entregador,
      lat: connection.lat,
      lng: connection.lng
    }

    this.server.emit('updated_location', { users: response })
  }
}
