import {Address as AddressType} from '@prisma/client';

export class Address {
  static serialize(a: AddressType) {
    return {
      ...a,
      createdAt: a.createdAt.valueOf(),
      updatedAt: a.createdAt.valueOf(),
    };
  }
}
