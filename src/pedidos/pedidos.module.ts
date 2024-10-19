import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CommonModule } from 'src/common/common.module'
import { PedidosController } from './pedidos.controller'
import { Pedido } from './entities/pedido.entity'
import { CommandHandlers } from './commands'
import { QueryHandlers } from './queries'
import { EventHandlers } from './events'

@Module({
  imports: [
    CqrsModule,
    CommonModule,
    TypeOrmModule.forFeature([Pedido])
  ],
  controllers: [PedidosController],
  providers: [...QueryHandlers, ...CommandHandlers, ...EventHandlers],
})
export class PedidosModule { }
