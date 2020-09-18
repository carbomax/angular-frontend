import { ProductStore } from './product.store';

export class PageProductStorage {

  content: ProductStore[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  first: boolean;
  sort: string;
  numberOfElements: number;

}
