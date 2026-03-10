import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Resend } from 'resend';

@Injectable()
export class NewsService {
  private resend: Resend;

  private get db(): any {
    return this.prisma;
  }

  constructor(private prisma: PrismaService) {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      this.resend = new Resend(apiKey);
    } else {
      console.warn('RESEND_API_KEY not found. News emails will not be sent.');
    }
  }

  async findAll() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.db.news.findMany({
      include: { author: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPublished() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.db.news.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const news = await this.db.news.findUnique({
      where: { id },
      include: { author: { select: { name: true, email: true } } },
    });
    if (!news) throw new NotFoundException('News item not found');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return news;
  }

  async create(data: Record<string, unknown>, authorId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const news = await this.db.news.create({
      data: {
        ...data,
        authorId,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (news.status === 'PUBLISHED') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await this.handlePublishEffects(news);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return news;
  }

  async update(id: string, data: Record<string, unknown>) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const oldNews = await this.db.news.findUnique({ where: { id } });
    if (!oldNews) throw new NotFoundException('News item not found');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const news = await this.db.news.update({
      where: { id },
      data: {
        ...data,
        publishedAt:
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          data.status === 'PUBLISHED' && oldNews.status !== 'PUBLISHED'
            ? new Date()
            : // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            oldNews.publishedAt,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (news.status === 'PUBLISHED' && oldNews.status !== 'PUBLISHED') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await this.handlePublishEffects(news);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return news;
  }

  async remove(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.db.news.delete({ where: { id } });
  }

  private async handlePublishEffects(news: {
    id: string;
    title: string;
    content: string;
    category: string;
  }) {
    // 1. Create in-app notifications for all users who want it
    const users = await this.prisma.user.findMany({
      where: { status: 'ACTIVE' } as any,
    });

    const notifications = (users as any[]).map((user: any) => ({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      userId: user.id as string,
      title: news.title,
      message: `New news in ${news.category}: ${news.title}`,
      type: 'NEWS',
      link: `/news/${news.id}`,
    }));

    await this.db.notification.createMany({
      data: notifications,
    });

    // 2. Send emails via Resend
    if (process.env.RESEND_API_KEY) {
      for (const user of users) {
        try {
          await this.resend.emails.send({
            from: 'Square21 <updates@square21.com>',
            to: user.email,
            subject: news.title,
            html: `
              <h1>${news.title}</h1>
              <p>${news.content.substring(0, 200)}...</p>
              <a href="${process.env.FRONTEND_URL ?? 'http://localhost:3000'}/news/${news.id}" style="padding:10px 20px;background:#0070f3;color:white;border-radius:5px;text-decoration:none">View News</a>
            `,
          });
        } catch (error) {
          console.error(`Failed to send email to ${user.email}:`, error);
        }
      }
    }
  }
}
