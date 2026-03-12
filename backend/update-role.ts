import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { PrismaService } from './src/common/prisma.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);
  
  const user = await prisma.user.update({
    where: { email: 'admin@square21.pk' },
    data: { role: 'ADMIN' },
  });
  console.log('User Role Updated:', user.role);
  
  await app.close();
}
bootstrap();
