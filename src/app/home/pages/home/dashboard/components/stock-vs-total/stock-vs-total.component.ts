import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-stock-vs-total',
  templateUrl: './stock-vs-total.component.html',
  styleUrls: ['./stock-vs-total.component.css']
})
export class StockVsTotalComponent implements OnInit {

  @Input() total: number = 0;
  @Input() withStock: number = 0;
  @Input() percent: number = 0;
  constructor() { }

  ngOnInit(): void {
  }

}
