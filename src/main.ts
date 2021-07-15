import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const PORT = process.env.PORT;
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter);
  await app.listen(PORT, () => console.log(`Server start on port ${PORT}`));
}
bootstrap();
