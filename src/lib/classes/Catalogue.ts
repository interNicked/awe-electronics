import {Product} from './Product';
import {Category} from './Category';

export class Catalogue {
  private static _instance: Catalogue;
  private products = new Map<string, Product>();

  private constructor() {}
  static get instance() {
    return (this._instance ??= new Catalogue());
  }

  add(product: Product) {
    this.products.set(product.id, product);
  }
  byCategory(catId: string) {
    return [...this.products.values()].filter(p =>
      p.categories.some(c => c.id === catId),
    );
  }
  all() {
    return [...this.products.values()];
  }
}
