import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsuariosModule } from './usuarios/usuarios.module'
import { PedidosModule } from './pedidos/pedidos.module'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'admin',
      database: 'lastmile',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true
    }),
    UsuariosModule,
    PedidosModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
