
export class ProductStore {
  sku: string;
  name: string;
  price: number;
  photo: string;
  categories: Map<string, string>;
  selected?: boolean;
}
