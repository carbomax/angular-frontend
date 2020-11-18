export class ChangeMultipleStatusRequest {
    constructor(    
      public accountId: number,
      public publicationsIds: string[]     
    ){}
  }