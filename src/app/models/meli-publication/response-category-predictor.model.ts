import { MeliPredictorCategory } from './meli-predictor-category.model';
import { MeliCategory } from './meli-category.model';

export class ResponseCategoryPredictor {    
    predictor: boolean;
    meliPredictorCategory: MeliPredictorCategory[];
    meliCategory: MeliCategory[];  
  }