import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-total-sales',
  templateUrl: './total-sales.component.html',
  styleUrls: ['./total-sales.component.css']
})
export class TotalSalesComponent implements OnInit {

  @Input() hiddenSellChart = true;
  @Input() countAllSalesPaid = 0;
  @Input() countAllSalesCancelled = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
