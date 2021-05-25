import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivationEnd, Router, UrlSegment } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ProductMeliPublished } from 'src/app/models/meli-publication/product-meli-published.model';
import { DataExportService } from '../../services/data-export.service';
import { SendInfoToComponentService } from '../../services/sendInfo-to-component.service';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {

  productsSelectedList: ProductMeliPublished[];

  public title: string;
  public titleSub$: Subscription;
  public urlSeg$: Subscription;
  public url: string;

  public selected: boolean = false;

  constructor(private router: Router, public dataExportService: DataExportService, public sendInfoToComponentService: SendInfoToComponentService) {
   this.titleSub$ = this.loadTitleBreadcrumbs()
                         .subscribe( ({title}) => {
                            this.title = title;
                            document.title = `Pepeganga-${this.title}`;
                          });
    this.urlSeg$ = this.loadURLBreadcrumbs().subscribe(url => {
      this.url = url[0].path;
    })

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.titleSub$.unsubscribe();
    this.urlSeg$.unsubscribe();
  }

  comboChanged(): void{
    this.productsSelectedList = [];
    this.productsSelectedList = this.sendInfoToComponentService.productPublishedList;

    if(this.productsSelectedList != null && this.productsSelectedList.length > 0){
      this.selected = true;
    }
    else {
      this.selected = false;
    }
  }

  exportData(value: number): void {
    /** 0 -> exportar todos, 1 -> exportar seleccionados**/
    value == 0 ? this.dataExportService.exportProductsPublished([]) : this.dataExportService.exportProductsPublished(this.productsSelectedList);
  }

  loadTitleBreadcrumbs() {
    return  this.router.events.pipe(
      filter( event => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
      map((event: ActivationEnd) => event.snapshot.data)
    );
  }

  loadURLBreadcrumbs() {
    return  this.router.events.pipe(
      filter( event => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
      map((event: ActivationEnd) => event.snapshot.url)
    );
  }



}
