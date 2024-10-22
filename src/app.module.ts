import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CqrsModule } from '@nestjs/cqrs'
import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { PedidosModule } from './domain/pedidos/pedidos.module'
import { UsuariosModule } from './domain/usuarios/usuarios.module'
import { PedidosNotifierModule } from './integrations/pedidos-notifier/pedidos-notifier.module'

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('BD_HOST'),
        port: 3306,
        username: config.get('BD_USER'),
        password: config.get('BD_PASSWORD'),
        database: config.get('BD_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true
      })
    }),
    UsuariosModule,
    PedidosModule,
    AuthModule,
    PedidosNotifierModule
  ]
})
export class AppModule { }
