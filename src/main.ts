import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }))
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST',
    allowedHeaders: 'Content-Type, Authorization',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true
  })

  const swagger_options = new DocumentBuilder()
    .setTitle('API Lastmile')
    .setDescription('API para gestão de entregas da Lastmile')
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'Ambiente local')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Token de acesso',
        in: 'header'
      },
      'bearer'
    )
    .addTag('usuarios')
    .addTag('pedidos')
    .build()

  const document = SwaggerModule.createDocument(app, swagger_options)
  SwaggerModule.setup('api/docs', app, document)

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
