import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-paginator-info',
  templateUrl: './table-paginator-info.component.html',
  styleUrls: ['./table-paginator-info.component.css']
})
export class TablePaginatorInfoComponent implements OnInit {

  @Input() total: number = 0;
  
  constructor() { }

  ngOnInit(): void {
  }

}
