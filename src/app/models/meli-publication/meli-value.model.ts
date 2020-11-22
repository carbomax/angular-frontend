import { Metadata } from './meli-metadata-model';

export class Value {
  constructor(    
    public id: string,
    public name: string,
    public metadata?: Metadata
  ){}   
}