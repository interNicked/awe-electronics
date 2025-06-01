import {CartItem, ProductOption} from '@prisma/client';
import {Customer} from './Customer';
import {Product} from './Product';
import {v4} from 'uuid';

export class ShoppingCart {
  id: string | null = null;
  items: CartItem[] = [];

  constructor(private owner: Customer) {}

  async add(product: Product, productOption: ProductOption, quantity = 1) {
    if (!this.id) throw new Error('Missing Cart ID');
    if (!product.id) throw new Error('Missing Product ID');

    const existing = this.items.find(
      i => i.productId === product.id && i.productOptionId === productOption.id,
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
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
          title: '',
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
