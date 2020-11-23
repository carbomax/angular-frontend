import { Tag } from './meli-tags-attributes.model';
import { Value } from './meli-value.model';

export class AttributesRequiredModel {
    constructor(  
        public id: string,
        public name: string,
        public tags?: Tag,
        public value_type?: string,  
        public value_max_length?: number,
        public value?: Value[],
        public allowed_units?: Value[],
        public attribute_group_id?: string,
        public attribute_group_name?: string
     ){}
 
}