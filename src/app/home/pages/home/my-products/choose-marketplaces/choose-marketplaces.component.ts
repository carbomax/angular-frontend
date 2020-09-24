import { Component, OnInit } from '@angular/core';

declare function initializePlugin();

@Component({
  selector: 'app-choose-marketplaces',
  templateUrl: './choose-marketplaces.component.html',
  styleUrls: ['./choose-marketplaces.component.css']
})
export class ChooseMarketplacesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
   initializePlugin();
  }

}
