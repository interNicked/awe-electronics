import { randomUUID } from 'crypto';
import {Customer} from './Customer';
import {ShoppingCart} from './ShoppingCart';

export enum OrderStatus {
  Pending,
  Paid,
  Shipped,
  Delivered,
  Refunded,
}

export class Order {
  readonly id: string = randomUUID();
  status = OrderStatus.Pending;
  readonly createdAt = new Date();

  constructor(
    readonly customer: Customer,
    readonly items: ReturnType<ShoppingCart['snapshot']>,
    public total: number,
  ) {}
  markPaid() {
    this.status = OrderStatus.Paid;
  }
}
