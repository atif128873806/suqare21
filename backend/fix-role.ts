import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { PrismaService } from './src/common/prisma.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);
  
  try {
    const user = await prisma.user.update({
      where: { email: 'admin@square21.pk' },
      data: { role: 'ADMIN' },
    });
    console.log(`Success! ${user.email} is now an ${user.role}.`);
  } catch (error) {
    if (error.code === 'P2025') {
      console.error("Error: User admin@square21.pk not found in the database.");
    } else {
      console.error("Failed:", error.message);
    }
  } finally {
    await app.close();
  }
}
bootstrap();
