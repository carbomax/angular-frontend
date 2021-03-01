export class MeliOrders {
  public id: number;
  public orderId: number;
  public status: string;
  public dateCreated: string;
  public dateClosed: string;
  public totalAmount = 0;
  public currencyId: string;
  public seller: SellerOrder;
  public buyer: BuyerOrder;
  public payments: PaymentOrder[];
  public items: ItemOrder[];
  public amountTaxes = 0;
  public operatorBusinessStatus = 0;
  public shippingId?: number;
  public invoiceNumberBss?: number;
  public operatorNameBss?: string;
  public descriptionBss?: string;
  public observationBss?: string;
  public tagBss?: number;
  public stateBss?: number;
  public carrier?: Carrier;
  public currencyIdTaxes?: string;
  public shipment?: OrderShipment;
  public sentToErp?: number;
  public countFails?: number;

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


export class OrderShipment {

  public id: number;

  public mode: string;

  public createBy: string;

  public orderId: number;

  public orderCost: number;

  public baseCost: number;

  public siteId: string;

  public status: string;

  public dateCreated: string;

  public lastUpdated: string;

  public shipmentCostComponent?: OrderShipmentCostComponent;
}


export class OrderShipmentCostComponent {

  public id = 0;
  public especialDiscount = 0;
  public loyalDiscount = 0;
  public compensation = 0;
  public gapDiscount = 0;
  public ratio = .0;

}
