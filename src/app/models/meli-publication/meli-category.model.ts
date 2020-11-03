import { MeliPathRoot } from './meli-path-from-root.model';

export class MeliCategory {

    id: string;
    name: string;
    picture: string;
    permalink: string;
    path_from_root: MeliPathRoot[];
    total_items_in_this_category: number;
    children_categories: MeliCategory[];
    attribute_types: string;
    attributable: boolean;
  
  }