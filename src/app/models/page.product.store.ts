import { ProductStore } from './product.store';

export class PageProductStorage {

  itemsGrid: ProductStore[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  first: boolean;
  sort: any;
  totalProducts: number;
  currentStock: number;
  selected?: boolean;
}
