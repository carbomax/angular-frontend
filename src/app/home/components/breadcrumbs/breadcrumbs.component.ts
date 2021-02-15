import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivationEnd, Router, UrlSegment } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {

  public title: string;
  public titleSub$: Subscription;
  public urlSeg$: Subscription;
  public url: string;

  constructor(private router: Router) {
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
