
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivationEnd, Router, UrlSegment } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ProductMeliPublished } from 'src/app/models/meli-publication/product-meli-published.model';
import { DataExportService } from '../../services/data-export.service';
import { SendInfoToComponentService } from '../../services/sendInfo-to-component.service';

// Alerts
import Swal from 'sweetalert2';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css'],
})
export class BreadcrumbsComponent implements OnDestroy {
  productsSelectedList: ProductMeliPublished[];

  public title: string;
  public titleSub$: Subscription;
  public urlSeg$: Subscription;
  public url: string;
  public downloading: boolean;

  public selected: boolean = false;
  public all: boolean = false;

  constructor(
    private router: Router,
    public dataExportService: DataExportService,
    public sendInfoToComponentService: SendInfoToComponentService
  ) {
    this.titleSub$ = this.loadTitleBreadcrumbs().subscribe(({ title }) => {
      this.title = title;
      document.title = `Pepeganga-${this.title}`;
    });
    this.urlSeg$ = this.loadURLBreadcrumbs().subscribe((url) => {
      this.url = url[0].path;
    });
  }

  ngOnDestroy(): void {
    this.titleSub$.unsubscribe();
    this.urlSeg$.unsubscribe();
  }

  comboChanged(): void {
    this.enableExportSelected();
    this.enableExportAll();
  }

  exportData(value: number): void {
    this.downloading = true;
    const fileName = 'productos publicados.xlsx';
    let selectedProducts: ProductMeliPublished[] = [];

    if (value != 0) {
      selectedProducts = [...this.productsSelectedList];
    }

    this.dataExportService.exportProductsPublished(selectedProducts).subscribe(
      (response: any) => {
        console.log('RESPONSE', response);
        let blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.shee',
        });
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob, fileName);
        } else {
          var a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          this.downloading = false;
        }
      },
      (err) => {
        this.downloading = false;
        console.log(err);
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error mientras se descargaba el archivo, intente nuevamente o contacte con el administrador',
          showConfirmButton: true
        });
      }
    );
  }

  loadTitleBreadcrumbs() {
    return this.router.events.pipe(
      filter((event) => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
      map((event: ActivationEnd) => event.snapshot.data)
    );
  }

  loadURLBreadcrumbs() {
    return this.router.events.pipe(
      filter((event) => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
      map((event: ActivationEnd) => event.snapshot.url)
    );
  }

  enableExportAll() : void {
    this.all = this.sendInfoToComponentService.countElementsOfList > 0 ? true : false;
  }

  enableExportSelected() : void {
    this.productsSelectedList = [];
    this.productsSelectedList =
      this.sendInfoToComponentService.productPublishedSelectedList;

    if (
      this.productsSelectedList != null &&
      this.productsSelectedList.length > 0
    ) {
      this.selected = true;
    } else {
      this.selected = false;
    }
  }

}
