export class Attributes {
    constructor(
      public id: string,   
      public name: string,         
      public valueName: string,      
      public valueId?: number, 
      public valueStruct?: any,
      public values?: any[],
      public attributeGroupId?: string,
      public attributeGroupName?: string          
    ){
  
    }
  
  }