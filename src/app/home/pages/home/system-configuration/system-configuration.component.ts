import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { SystemConfigService } from 'src/app/home/services/systems-config.service';
import { MLUListingType } from 'src/app/models/meli-publication/meli-listing-type.model';
import { PublicationConfigModel } from 'src/app/models/system-configuration/publication-config.model';
import { SynchronizationConfigModel } from 'src/app/models/system-configuration/synchronization-config.model';
import { SystemConfigModel } from 'src/app/models/system-configuration/system-config.model';

@Component({
  selector: 'app-system-configuration',
  templateUrl: './system-configuration.component.html',
  styleUrls: ['./system-configuration.component.css']
})
export class SystemConfigurationComponent implements OnInit {

  listingTypeList: MLUListingType[];
  synchrConfig: SynchronizationConfigModel = new SynchronizationConfigModel();
  publicationConfig: PublicationConfigModel = new PublicationConfigModel();
  listingType: string;
  stock_risk: number;
  flex: boolean;
  loading: boolean = false;
  canceling: boolean = false;

  constructor(public systemConfigService: SystemConfigService ) {
    this.systemConfigService.getMLUListingTypes().subscribe(list => this.listingTypeList = list);
  }

  ngOnInit(): void {
    this.systemConfigService.readAttributesConfig().subscribe(result => {
      this.allocateProperties(result);
    });

  }

  allocateProperties(systemConfig: SystemConfigModel): void {
    this.synchrConfig = systemConfig.synchronization_config;
    this.publicationConfig = systemConfig.publication_config;
    //Publication properties
    this.flex = this.publicationConfig.flex === 'yes' ? true : false;
    this.listingType = this.publicationConfig.publication_type;
    //Synchronization properties
    this.stock_risk = this.synchrConfig.stock_risk;
  }

  compareListingType( listingType1:string, listingType2:string) {
    if (listingType1 == '' || listingType2 == '') {
      return false;
    }
    return listingType1===listingType2;
  }

  savePublicationProperties(): void {
    this.loading = true;
    let pConfig = new PublicationConfigModel();
    pConfig.flex = this.flex ? 'yes': 'not';
    pConfig.publication_type = this.listingType;
    this.systemConfigService.updateAttributesConfig(pConfig).subscribe(result => {
      this.allocateProperties(result);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Guardado!!!`,
        text: `Configuración almacenada correctamente.`,
        showConfirmButton: false,
        timer: 5000
      });
    });
    this.loading = false;
  }

  saveSynchronizationProperties(): void {
    if(this.stock_risk >= 0) {
      let sConfig = new SynchronizationConfigModel();
      sConfig.stock_risk = this.stock_risk;
      sConfig.synchronization_time = this.synchrConfig.synchronization_time;
      this.systemConfigService.updateAttributesConfig(null, sConfig).subscribe(result => {
        this.allocateProperties(result);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `Guardado!!!`,
          text: `Configuración almacenada correctamente.`,
          showConfirmButton: false,
          timer: 5000
        });
      });
    }else {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: `Incorrecto`,
        text: `El número de stock debe ser mayor a cero.`,
        showConfirmButton: false,
        timer: 5000
      });
    }
  }

  cancelProperties(): void {
    this.canceling = true;
    this.systemConfigService.readAttributesConfig().subscribe(result => {
      this.allocateProperties(result);
    });
    this.canceling = false;
  }

}
