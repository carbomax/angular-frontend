import { Attributes } from './attributes.meli';

export class MeliPredictorCategory {
  constructor(
    public domainId: string,
    public domainName: string,
    public categoryId: string,
    public categoryName: string,
    public attributes: Attributes[]
  ){}
     
  }