import {Catalogue} from './Catalogue';
import {Product} from './Product';

export class ProductManager {
  private static _i: ProductManager;
  private constructor(private cat = Catalogue.instance) {}
  static get instance() {
    return (this._i ??= new ProductManager());
  }

  addProduct(data: Product) {
    this.cat.add(data);
  }
  editProduct(id: string, changes: Partial<Product>) {
    /* update */
  }
  deleteProduct(id: string) {
    /* remove */
  }
  bulkUpdate(ids: string[], changes: Partial<Product>) {}
}
