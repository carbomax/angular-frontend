import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-global-loading',
  templateUrl: './global-loading.component.html',
  styleUrls: ['./global-loading.component.css']
})
export class GlobalLoadingComponent implements OnInit {

  @Input() globalLoading = false;

  @Input() globalLoadingDescription = '';

  constructor() { }

  ngOnInit(): void {
  }

}
