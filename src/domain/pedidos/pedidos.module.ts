import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PedidosController } from './pedidos.controller'
import { Pedido } from './entities/pedido.entity'
import { CommandHandlers } from './commands'
import { QueryHandlers } from './queries'
import { EventHandlers } from './events'
import { WebsocketModule } from 'src/integrations/websocket/websocket.module'

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Pedido]),
    WebsocketModule
  ],
  controllers: [PedidosController],
  providers: [...QueryHandlers, ...CommandHandlers, ...EventHandlers],
})
export class PedidosModule { }
