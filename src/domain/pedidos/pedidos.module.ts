import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PedidosController } from './pedidos.controller'
import { Pedido } from './entities/pedido.entity'
import { CommandHandlers } from './commands'
import { QueryHandlers } from './queries'
import { EventHandlers } from './events'
import { PedidosNotifierModule } from 'src/integrations/pedidos-notifier/pedidos-notifier.module'

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Pedido]),
    PedidosNotifierModule
  ],
  controllers: [PedidosController],
  providers: [...QueryHandlers, ...CommandHandlers, ...EventHandlers],
})
export class PedidosModule { }
