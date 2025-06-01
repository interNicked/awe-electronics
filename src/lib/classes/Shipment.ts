import {Shipment as ShipmentType} from '@prisma/client';

export class Shipment {
  static serialize(shipment: ShipmentType) {
    return {
      ...shipment,
      eta: shipment.eta?.valueOf() ?? null,
      shippedAt: shipment.shippedAt?.valueOf() ?? null,
      updatedAt: shipment.updatedAt.valueOf(),
      createdAt: shipment.createdAt.valueOf(),
    };
  }
}
