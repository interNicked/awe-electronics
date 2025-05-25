import {Order} from './Order';
import {Invoice} from './Invoice';

export class InvoiceManager {
  private static _i: InvoiceManager;
  private invoices = new Map<string, Invoice>();
  private constructor() {}
  static get instance() {
    return (this._i ??= new InvoiceManager());
  }

  generate(order: Order) {
    const inv = new Invoice(order);
    this.invoices.set(inv.id, inv);
    return inv;
  }
  find(id: string) {
    return this.invoices.get(id);
  }
  refund(orderId: string, reason: string) {}
}
