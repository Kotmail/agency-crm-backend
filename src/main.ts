import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  app.enableCors()

  const swaggerConfig = new DocumentBuilder()
    .addBearerAuth(
      {
        type: 'http',
        bearerFormat: 'JWT',
        description: 'Input your JWT token',
        in: 'header',
      },
      'Auth',
    )
    .setTitle('AgencyCRM API')
    .setDescription('The AgencyCRM API documentation.')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)

  SwaggerModule.setup('swagger', app, document)

  await app.listen(3000)
}
bootstrap()
