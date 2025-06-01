import Prisma from '@prisma/client';

export class Product {
  readonly id: string;
  title: string;
  description: string;
  images: string[];
  basePrice: number;
  status: Prisma.$Enums.ProductStatus = 'out_of_stock';
  barcode?: string;
  createdAt: string | Date;
  updatedAt: string | Date;

  constructor(
    id: string,
    title: string,
    desc: string,
    price: number,
    images = [],
  ) {
    this.id = id;
    this.title = title;
    this.description = desc;
    this.images = images;
    this.basePrice = price;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static serialize(product: Prisma.Product) {
    return {
      ...product,
      createdAt: product.createdAt.valueOf(),
      updatedAt: product.updatedAt.valueOf(),
    };
  }

  static from(product: Prisma.Product) {
    const p = new Product(
      product.id,
      product.title,
      product.description,
      product.basePrice,
    );

    p.basePrice = product.basePrice;
    p.images = product.images;

    return p;
  }
}
