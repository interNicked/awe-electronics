import {Order} from './Order';

export class Shipment {
  constructor(
    public readonly order: Order,
    public carrier: string,
    public trackingNumber: string,
    public eta: Date,
  ) {}
}
