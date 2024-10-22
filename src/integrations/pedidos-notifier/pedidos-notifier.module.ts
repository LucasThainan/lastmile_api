import { Module } from '@nestjs/common'
import { PedidosNotifierGateway } from './pedidos-notifier.gateway'

@Module({
  providers: [PedidosNotifierGateway],
  exports: [PedidosNotifierGateway],
})
export class PedidosNotifierModule {}
