export class MeliOrders {
  public id: number;
  public orderId: number;
  public status: string;
  public dateCreated: string;
  public dateClosed: string;
  public totalAmount: number;
  public currencyId: string;
  public shippingId: number;
  public seller: SellerOrder;
  public buyer: BuyerOrder;
  public payments: PaymentOrder[];
  public items: ItemOrder[];
  public invoiceNumberBss?: number;
  public descriptionBss?: string;
  public observationBss?: string;
  public tagBss?: number;
  public stateBss?: number;
  public carrier?: Carrier;

}


export class PaymentOrder {
  id: number;
  paymentId: number;
  transactionAmount: number;
  currencyId: string;
  status: string;
}

export class SellerOrder {
  public id: number;
  public sellerId: number;
  public nickname: string;
  public email: string;
  public firstsName: string;
  public lastName: string;
}

export class BuyerOrder {
  public id: number;
  public buyerId: number;
  public nickname: string;
  public email: string;
  public firstName: string;
  public lastName: string;
  public meliOrderBuyerBillingInfo: BuyerBillingInfo;
}

export class BuyerBillingInfo {
  public id: number;
  public docNumber: number;
  public docType: string;
}


export class ItemOrder {
  public id: number;
  public itemId: string;
  public title: string;
  public categoryId: string;
  public sellerSku: string;
  public quantity: number;
  public unitPrice: number;
  public currencyId: string;
}


export class Carrier {
  public id: number;
  public name: string;
}
