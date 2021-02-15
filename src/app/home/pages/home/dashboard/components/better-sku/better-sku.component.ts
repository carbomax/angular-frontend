import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-better-sku',
  templateUrl: './better-sku.component.html',
  styleUrls: ['./better-sku.component.css']
})
export class BetterSkuComponent implements OnInit {

  @Input() betterSku: string = '';
  constructor() { }

  ngOnInit(): void {
  }

}
