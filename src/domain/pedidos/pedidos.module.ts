import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PedidosController } from './pedidos.controller'
import { Pedido } from './entities/pedido.entity'
import { CommandHandlers } from './commands'
import { QueryHandlers } from './queries'
import { EventHandlers } from './events'
import { DomainEventsDispatcher } from '../shared/domain-events/domain-events-dispatcher'

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Pedido])
  ],
  controllers: [PedidosController],
  providers: [...QueryHandlers, ...CommandHandlers, ...EventHandlers, DomainEventsDispatcher],
})
export class PedidosModule { }
