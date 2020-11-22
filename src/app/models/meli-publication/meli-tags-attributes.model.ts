export class Tag {
    constructor(    
        public fixed?: boolean,
        public hidden?: boolean,
        public read_only?: boolean, 
        public variation_attribute?: boolean,
        public multivalued?: boolean,
        public required?: boolean,
        public conditional_required?: boolean
      ){}
    
}