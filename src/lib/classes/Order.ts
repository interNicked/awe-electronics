import {randomUUID} from 'crypto';
import {Customer} from './Customer';
import {ShoppingCart} from './ShoppingCart';
import {Address, Order as OrderType, OrderItem} from '@prisma/client';
import {Shipment} from './Shipment';

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

  static serialize({
    order,
    shipment,
    items = [],
    addresses = [],
  }: {
    order: OrderType;
    shipment?: ReturnType<typeof Shipment.serialize>;
    items?: OrderItem[];
    addresses?: Address[];
  }) {
    const _order = {
      ...order,
      createdAt: order.createdAt.valueOf(),
      updatedAt: order.createdAt.valueOf(),
      addresses: addresses.map(a => {
        return {
          ...a,
          createdAt: a.createdAt.valueOf(),
          updatedAt: a.createdAt.valueOf(),
        };
      }),
      items,
    };

    return shipment ? {..._order, shipment} : _order;
  }
}
