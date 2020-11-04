import { FamilyProductStorage } from './family.product.store';

export class ProductCustom {
    id: number;
    sku: string;
    name: string;
    priceUYU: number;
    currentStock: number;
    images: any[];
    family: FamilyProductStorage;
    state: string;
    selected?: boolean;
  }
