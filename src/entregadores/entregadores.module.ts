import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EntregadoresService } from './entregadores.service'
import { EntregadoresController } from './entregadores.controller'
import { Entregador } from './entities/entregador.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Entregador])],
  controllers: [EntregadoresController],
  providers: [EntregadoresService],
})
export class EntregadoresModule { }
