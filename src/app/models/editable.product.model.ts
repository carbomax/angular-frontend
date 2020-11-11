import { Image } from './image.model';

export class EditableProductModel{
    id: number;	
	
	productName: string;		
	
	description: string;		
	
	states: number;	
	
	price: number;	

	images: Image[];
	
	/* **No editable fields** */
	sku: string;
	
	price_costUYU: number;

	price_costUSD: number;
	
	currentStock: number;
}