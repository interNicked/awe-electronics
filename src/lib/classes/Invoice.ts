import { randomUUID } from 'crypto';
import {Order} from './Order';

export class Invoice {
  readonly id: string = randomUUID();
  readonly issued = new Date();

  constructor(
    public readonly order: Order,
    public readonly taxRate = 0.1,
  ) {}
  summary() {
    /* line items + GST */
  }
  totalWithTax() {
    return this.order.total * (1 + this.taxRate);
  }
}
