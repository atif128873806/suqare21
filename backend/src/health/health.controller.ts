import {
  Controller,
  Get,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

/**
 * Liveness / readiness endpoint.
 *
 * Used by:
 *  - deploy/release.sh as a post-deploy smoke test
 *  - uptime monitoring / load balancer checks
 *
 * Returns 200 when the API is up and the database answers, 503 otherwise.
 * Deliberately unauthenticated and dependency-free (no auth, no DTOs).
 */
@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check() {
    const payload: {
      status: 'ok' | 'degraded';
      service: string;
      uptime: number;
      timestamp: string;
      database: 'up' | 'down';
    } = {
      status: 'ok',
      service: 'square21-api',
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
      database: 'up',
    };

    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      payload.status = 'degraded';
      payload.database = 'down';
      this.logger.error(
        `Health check failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      throw new ServiceUnavailableException(payload);
    }

    return payload;
  }
}
