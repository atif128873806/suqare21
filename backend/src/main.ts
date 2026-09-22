import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { json, urlencoded } from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
    rawBody: true,
  });

  // Trust first proxy (Nginx) for correct IP detection in rate limiting
  app.set('trust proxy', 1);

  // Security headers
  app.use(helmet());

  // Increase body parser limit for image and video uploads
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  // Global rate limit: 100 requests per 15 minutes per IP
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: { statusCode: 429, message: 'Too many requests, please try again later.' },
    }),
  );

  // Stricter rate limit for auth endpoints: 10 attempts per 15 minutes
  app.use(
    '/auth',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 10,
      message: { statusCode: 429, message: 'Too many auth attempts, please try again later.' },
    }),
  );

  // Stricter rate limit for chatbot: 30 messages per 15 minutes per IP
  app.use(
    '/chatbot',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 30,
      message: { statusCode: 429, message: 'Too many messages, please slow down.' },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // --- CORS allowlist -------------------------------------------------------
  // FRONTEND_URL may hold a comma-separated list of origins. The www/non-www
  // sibling of every configured origin is allowed as well: the site answers
  // on both hostnames, and a visitor on the "other" one would otherwise have
  // every browser-side API call blocked (Safari reports that as
  // "Load failed", Chrome as "Failed to fetch").
  const stripSlash = (value: string) => value.trim().replace(/\/+$/, '');

  const withWwwSibling = (origin: string): string[] => {
    const normalized = stripSlash(origin);
    if (!normalized) return [];
    try {
      const { protocol, hostname, port } = new URL(normalized);
      const suffix = port ? `:${port}` : '';
      if (hostname.startsWith('www.')) {
        return [normalized, `${protocol}//${hostname.slice(4)}${suffix}`];
      }
      if (hostname.split('.').length === 2) {
        return [normalized, `${protocol}//www.${hostname}${suffix}`];
      }
      return [normalized];
    } catch {
      return [normalized];
    }
  };

  const allowedOrigins = (
    process.env.FRONTEND_URL || 'https://square21marketing.com'
  )
    .split(',')
    .flatMap(withWwwSibling);

  // Local development frontends, so a localhost build is not blocked either.
  if (process.env.NODE_ENV !== 'production') {
    allowedOrigins.push('http://localhost:3000', 'http://127.0.0.1:3000');
  }

  console.log(`CORS allowlist: ${allowedOrigins.join(', ')}`);

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(process.env.PORT ?? 3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
