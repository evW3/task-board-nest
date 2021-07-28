import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import * as fs from 'fs';
import path from 'path';

async function bootstrap() {
    const PORT = process.env.PORT;
    const app = await NestFactory.create(AppModule);
    app.useGlobalFilters(new HttpExceptionFilter);
    initUploadDir();
    await app.listen(PORT, () => console.log(`Server start on port ${PORT}`));
}

function initUploadDir() {
  const uploadDirFullPath = path.resolve(__dirname, '..', 'uploads');

  if (!fs.existsSync(uploadDirFullPath)) {
    fs.mkdirSync(uploadDirFullPath);
  }
}

bootstrap();
