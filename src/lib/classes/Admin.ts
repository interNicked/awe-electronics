import { $Enums } from '@prisma/client';
import { User } from './User';

export class Admin extends User {
  role: $Enums.UserRole = 'admin'

  constructor({
    id,
    email,
    passwordHash,
  }: {
    id: string;
    email: string;
    passwordHash: string;
  }) {
    super({id, email, passwordHash});
  }
}
