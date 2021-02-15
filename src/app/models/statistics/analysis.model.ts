export class AnalysisDrop {

  date: string;
  totalSalesCount: number;
  totalAmount: number;
  sellerAnalysisDrop: SellerAnalysisDrop[];

}

export class SellerAnalysisDrop {

  amount: number;
  salesCount: number;
  sellerId: number;
  sellerName: string;

}
