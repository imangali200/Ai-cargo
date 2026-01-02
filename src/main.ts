import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
  origin: ['http://localhost:3000','https://ai-cargo-front.vercel.app', 'https://ai-market.kz', 'https://www.ai-market.kz'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
  
});


  const config = new DocumentBuilder()
    .setTitle("Ai-cargo API")
    .setDescription('cargo api')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type:'http',
        scheme:'bearer',
        bearerFormat:'JWT',
        in:'header',
        description: 'Enter JWT token',
      },
      'Authorization'
    )
    .build()
  
  const document = SwaggerModule.createDocument(app,config)
  SwaggerModule.setup('api-docs',app,document)
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
