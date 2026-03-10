import { Request } from 'express';

export type UserRole = 'USER' | 'ADMIN';

export interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
}
