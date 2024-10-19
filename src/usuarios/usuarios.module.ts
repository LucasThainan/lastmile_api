import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CqrsModule } from '@nestjs/cqrs'
import { JwtModule } from '@nestjs/jwt'
import { QueryHandlers } from './queries'
import { CommandHandlers } from './commands'
import { UsuariosController } from './usuarios.controller'
import { Usuario } from './entities/usuario.entity'
import { Entregador } from './entities/entregador.entity'

@Module({
  imports: [
    CqrsModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '60s' }
      })
    }),
    TypeOrmModule.forFeature([Usuario, Entregador])
  ],
  controllers: [UsuariosController],
  providers: [...QueryHandlers, ...CommandHandlers],
})
export class UsuariosModule { }
