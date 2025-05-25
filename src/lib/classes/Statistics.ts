import {Order} from './Order';

export class Statistics {
  private static _i: Statistics;
  private sales: Order[] = [];
  private constructor() {}
  static get instance() {
    return (this._i ??= new Statistics());
  }

  log(order: Order) {
    this.sales.push(order);
  }
  overview() {
    const revenue = this.sales.reduce((s, o) => s + o.total, 0);
    return {orders: this.sales.length, revenue};
  }
}
