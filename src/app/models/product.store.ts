import { CategoryProductStoraje } from './category.product.storaje';
import { FamilyProductStorage } from './family.product.store';

export class ProductStore {
  sku: string;
  name: string;
  priceUYU: number;
  priceUSD: number;
  currentStock: number;
  images: any[];
  categories: CategoryProductStoraje[];
  family: FamilyProductStorage;
  existInMeliStore: boolean;
  selected?: boolean;
}
