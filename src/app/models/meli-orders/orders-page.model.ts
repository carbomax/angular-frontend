import { MeliOrders, Carrier } from './meli-orders.model';
export class OrderPage {

  content: MeliOrders [];
  totalElements: number;
  carries: Carrier[] = [
    {id: 0, name: 'NINGUNO'},
    {id: 1, name: 'UES'},
    {id: 2, name: 'DA'},
    {id: 3, name: 'MIRTRANS'},
    {id: 4, name: 'CERRO'},
    {id: 5, name: 'FLEX'},
    {id: 4, name: 'AGENCIA'}
  ];

}


