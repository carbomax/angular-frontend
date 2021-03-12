export class Shipping {
    constructor(
      public mode: string,
      public localPickUp: boolean,
      public freeShipping: boolean,
      public freeMethods: string[],
      public tags?: string[]
     /* public dimensions?: any,
      public tags?: string[],
      public logisticType?: string,
      public storePickUp?: boolean*/
    ){}
  }
