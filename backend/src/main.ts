import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
//import { RolesGuard } from './auth/guards/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
 app.enableCors({
  origin: 'http://localhost:5173',    
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}); // Or configure CORS app.enableCors({ origin: ['http://localhost:3000'], // frontend URL methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', credentials: true, });
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
  

await app.listen(3001, () => {
    console.log('Server is running on http://localhost:3001');
  });
}
bootstrap();