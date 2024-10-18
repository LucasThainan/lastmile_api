import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { EntregadoresModule } from './entregadores/entregadores.module'
import { TypeOrmModule } from '@nestjs/typeorm'

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
    EntregadoresModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
