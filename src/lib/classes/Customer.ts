import {User as UserClass} from './User';
import {ShoppingCart} from './ShoppingCart';
import Prisma from '@prisma/client';

export class Customer extends UserClass {
  cart = new ShoppingCart(this);
  role: Prisma.$Enums.UserRole = 'customer';

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
