import { v4 } from 'uuid';
import {Customer} from './Customer';
import {Product} from './Product';

export class ShoppingCart {
  id: string | null = null;
  items: any[] = [];

  constructor(private owner: Customer) {}

  async add(product: Product, productOption: any, quantity = 1) {
    if (!this.id) throw new Error('Missing Cart ID');
    if (!product.id) throw new Error('Missing Product ID');

    const existing = this.items.find(
      i => i.productId === product.id && i.productOptionId === productOption.id,
    );
    existing
      ? (existing.quantity += quantity)
      : this.items.push({
        id: v4(),
        cartId: this.id,
        productId: product.id,
        basePrice: product.basePrice,
        productOptionId: productOption.id,
        extraPrice: productOption.extra,
        quantity,
      });
  }
  async remove(productId: string, productOptionId?: string) {
    this.items = this.items.filter(
      i =>
        !(i.productId === productId && i.productOptionId === productOptionId),
    );
  }
  total(): number {
    return this.items.reduce((sum, i) => sum + i.basePrice * i.quantity, 0);
  }
  snapshot() {
    return structuredClone(this.items);
  }
}
