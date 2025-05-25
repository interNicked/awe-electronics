import {Category} from './Category';
import { PrismaResource } from './PrismaResource';

import Prisma from '@/prisma/generated';

export class Product extends PrismaResource {  
  readonly id: string;
  title: string;
  description: string;
  images: string[];
  basePrice: number;
  status: Prisma.$Enums.ProductStatus = 'out_of_stock';
  categories: Category[] = [];
  barcode?: string;
  createdAt: String | Date;
  updatedAt: String | Date;

  constructor(id: string, title: string, desc: string, price: number, images = []) {
    super()
    this.id = id;
    this.title = title;
    this.description = desc;
    this.images = images;
    this.basePrice = price;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  verifyStock(opt: {attr: string; value: string}, qty = 1) {
    /* consult options */
  }

  create(args: unknown): Promise<unknown> {
    throw new Error('Method not implemented.');
  }
  read(args: unknown): Promise<unknown> {
    throw new Error('Method not implemented.');
  }
  update(args: unknown): Promise<unknown> {
    throw new Error('Method not implemented.');
  }
  delete(args: unknown): Promise<unknown> {
    throw new Error('Method not implemented.');
  }

  static serialize(product: Prisma.Product){
    return {
      ...product,
      createdAt: product.createdAt.valueOf(),
      updatedAt: product.updatedAt.valueOf(),
    }
  }

  static from(product: Prisma.Product){
    const p = new Product(product.id, product.title, product.description, product.basePrice)

    p.basePrice = product.basePrice;
    p.images = product.images

    return p
  }
}
