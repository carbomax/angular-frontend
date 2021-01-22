import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-active-publications',
  templateUrl: './active-publications.component.html',
  styleUrls: ['./active-publications.component.css']
})
export class ActivePublicationsComponent implements OnInit {

  @Input('actives') countActivePublications: number = 0;
  constructor() { }

  ngOnInit(): void {
  }

}
