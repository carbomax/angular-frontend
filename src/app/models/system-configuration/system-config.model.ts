import { SynchronizationConfigModel } from './synchronization-config.model';
import { PublicationConfigModel } from './publication-config.model';

export class SystemConfigModel {

  creation_date: string;
  publication_config: PublicationConfigModel;
  synchronization_config: SynchronizationConfigModel;
}
