import { CategoryProductStoraje } from './category.product.storaje';

export class ProductStore {
  sku: string;
  name: string;
  priceUYU: number;
  priceUSD: number;
  currentStock: number;
  images: any[];
  categories: CategoryProductStoraje[];
  selected?: boolean;
}
