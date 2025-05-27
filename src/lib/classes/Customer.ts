import {User as UserClass} from './User';
import {ShoppingCart} from './ShoppingCart';
import Prisma from '@prisma/client';

export class Customer extends UserClass {
  cart = new ShoppingCart(this);

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

  async login(token: string) {
    /* MFA check */
  }
  async resetPassword(t: string, p: string) {
    /* email link check */
  }

  viewAccount() {
    return {id: this.id, email: this.email};
  }

  static serialize(customer: Customer | Prisma.User) {
    return {
      id: customer.id,
      email: customer.email,
      passwordHash: customer.passwordHash,
    };
  }

  static Guest = new Customer({
    id: '00000000-00000000-00000000-00000001',
    email: 'guest@unknown.com',
    passwordHash: '',
  });
}
