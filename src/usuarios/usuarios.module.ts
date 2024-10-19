import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CqrsModule } from '@nestjs/cqrs'
import { QueryHandlers } from './queries'
import { CommandHandlers } from './commands'
import { UsuariosController } from './usuarios.controller'
import { Usuario } from './entities/usuario.entity'
import { Entregador } from './entities/entregador.entity'

@Module({
  imports: [CqrsModule ,TypeOrmModule.forFeature([Usuario, Entregador])],
  controllers: [UsuariosController],
  providers: [...QueryHandlers, ...CommandHandlers],
})
export class UsuariosModule { }
