import { ProductStore } from '../../../../../models/product.store';
import { CategoryProductStoraje } from '../../../../../models/category.product.storaje';


export const PRODUCTS_STORAGE: ProductStore [] = [
  { sku: '1', name: 'Carro Chocon', price: 50 , photo: 'https://bootdey.com/img/Content/user_1.jpg' , categories: new Map([
    ['1', 'Jueguetes'],
    ['6', 'Tecnología']
])
},
  { sku: '2', name: 'Muñeca de Trapo', price: 25 , photo: 'https://bootdey.com/img/Content/user_1.jpg', categories:  new Map([
    ['1', 'Jueguetes'],
    ['6', 'Otra categoria']
])},
  { sku: '3', name: 'Robot policia', price: 65 , photo: 'https://bootdey.com/img/Content/user_1.jpg', categories:  new Map([
    ['1', 'Jueguetes'],
    ['6', 'Otra categoria']
])},
  { sku: '4', name: 'Silla Gamer', price: 400 , photo: 'https://bootdey.com/img/Content/user_1.jpg', categories:  new Map([
    ['1', 'Jueguetes'],
    ['6', 'Otra categoria']
])},
  { sku: '5', name: 'Laptop Gamer', price: 500 , photo: 'https://bootdey.com/img/Content/user_1.jpg', categories:  new Map([
    ['1', 'Jueguetes']
])},
]
