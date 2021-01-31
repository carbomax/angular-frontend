import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';


declare function initializePlugin();
@Component({
  selector: 'app-sidebard',
  templateUrl: './sidebard.component.html',
  styleUrls: ['./sidebard.component.css']
})
export class SidebardComponent implements OnInit {

  toggled: boolean = false;
  logoSrc: string  = 'assets/img/pepepaganga_ico.png';

  constructor(public sidebarService: SidebarService ) {

  }

  ngOnInit(): void {
    initializePlugin();
  }




}
