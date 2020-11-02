import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
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

  constructor(private router: Router) {
   this.titleSub$ = this.loadTitleBreadcrumbs()
                         .subscribe( ({title}) => {
                            this.title = title;
                            document.title = `Pepeganga-${this.title}`;
                          });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.titleSub$.unsubscribe();
  }

  loadTitleBreadcrumbs() {
    return  this.router.events.pipe(
      filter( event => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
      map((event: ActivationEnd) => event.snapshot.data)
    );
  }

}
