import { Injectable, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma.service';
import { Resend } from 'resend';

@Injectable()
export class SubscribersService {
    private readonly logger = new Logger(SubscribersService.name);
    private resend: Resend | null = null;

    constructor(
        private prisma: PrismaService,
        private configService: ConfigService,
    ) {
        const apiKey = this.configService.get<string>('RESEND_API_KEY');
        console.log('[SubscribersService] RESEND_API_KEY present:', !!apiKey);
        if (apiKey) {
            this.resend = new Resend(apiKey);
            this.logger.log('Resend initialized successfully');
        } else {
            this.logger.warn('RESEND_API_KEY not found — newsletter sending disabled');
        }
    }

    async create(email: string) {
        try {
            return await this.prisma.subscriber.create({
                data: { email },
            });
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('This email is already subscribed.');
            }
            throw error;
        }
    }

    async findAll() {
        return this.prisma.subscriber.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async remove(id: string) {
        return this.prisma.subscriber.delete({
            where: { id },
        });
    }

    async sendNewsletter(subject: string, body: string) {
        this.logger.log(`sendNewsletter called — subject: "${subject}"`);

        if (!subject || !body) {
            throw new BadRequestException('Subject and body are required.');
        }

        if (!this.resend) {
            this.logger.error('Resend not initialized — RESEND_API_KEY missing');
            throw new BadRequestException('Email service is not configured. Set RESEND_API_KEY.');
        }

        const subscribers = await this.prisma.subscriber.findMany();
        this.logger.log(`Found ${subscribers.length} subscribers`);

        if (subscribers.length === 0) {
            return { sent: 0, failed: 0, message: 'No subscribers found.' };
        }

        const fromEmail = 'Square21 <noreply@square21marketing.com>';
        const frontendUrl = process.env.FRONTEND_URL || 'https://square21marketing.com';

        const htmlTemplate = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
  <tr><td style="background-color:#0a0a0f;padding:32px 40px;text-align:center;">
    <h1 style="color:#ffffff;font-size:22px;margin:0;font-weight:700;letter-spacing:1px;">Square<span style="color:#e11d48;">21</span> Marketing</h1>
  </td></tr>
  <tr><td style="padding:40px;">
    <h2 style="color:#0a0a0f;font-size:24px;margin:0 0 20px;font-weight:700;">${subject}</h2>
    <div style="color:#374151;font-size:15px;line-height:1.7;">${body}</div>
  </td></tr>
  <tr><td style="padding:0 40px 32px;">
    <a href="${frontendUrl}/properties" style="display:inline-block;background-color:#e11d48;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Browse Properties</a>
  </td></tr>
  <tr><td style="background-color:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb;">
    <p style="color:#9ca3af;font-size:12px;margin:0;text-align:center;">
      You received this because you subscribed to Square21 Marketing updates.<br>
      <a href="${frontendUrl}" style="color:#e11d48;text-decoration:none;">square21marketing.com</a>
    </p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

        let sent = 0;
        let failed = 0;
        const errors: string[] = [];

        // Send in batches of 10 to respect rate limits
        const batchSize = 10;
        for (let i = 0; i < subscribers.length; i += batchSize) {
            const batch = subscribers.slice(i, i + batchSize);
            const results = await Promise.allSettled(
                batch.map(sub =>
                    this.resend!.emails.send({
                        from: fromEmail,
                        to: sub.email,
                        subject,
                        html: htmlTemplate,
                    })
                )
            );

            for (let j = 0; j < results.length; j++) {
                if (results[j].status === 'fulfilled') {
                    sent++;
                } else {
                    failed++;
                    const reason = (results[j] as PromiseRejectedResult).reason;
                    this.logger.error(`Failed to send to ${batch[j].email}: ${JSON.stringify(reason)}`);
                    errors.push(batch[j].email);
                }
            }
        }

        this.logger.log(`Newsletter complete — sent: ${sent}, failed: ${failed}, total: ${subscribers.length}`);

        return {
            sent,
            failed,
            total: subscribers.length,
            message: `Newsletter sent to ${sent} of ${subscribers.length} subscribers.`,
            ...(errors.length > 0 && { failedEmails: errors }),
        };
    }
}
