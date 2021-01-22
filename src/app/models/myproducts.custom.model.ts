import { FamilyProductStorage } from './family.product.store';

export class ProductCustom {
    id: number;
    sku: string;
    name: string;
    priceUYU: number;
    priceUSD: number;
    price_costUYU: number;
    price_costUSD: number;
    description: string;
    currentStock: number;
    images: any[];
    family: FamilyProductStorage;
    state: string;
    deleted: number;
    specialPaused: number;
    selected?: boolean;
  }
