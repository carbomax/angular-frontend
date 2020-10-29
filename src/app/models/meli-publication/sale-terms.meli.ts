export class SaleTerms {
    constructor(
      public id: string,
      public name: string,
      public valueId: string,
      public valueName: string,
      public valueStruct?: any,
      public values?: any[]     
    ){}
  }