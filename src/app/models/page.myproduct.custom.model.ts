import { ProductCustom } from './myproducts.custom.model';

export class PageProductMeliStorage {

    itemsMeliGrid: ProductCustom[];
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