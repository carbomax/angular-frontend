import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  toAdmin = false;
  constructor( private authService: AuthService) {
    console.log('pasando c el router', this.authService.authenticationDataExtrac())
    if(this.authService.authenticationDataExtrac().roles.includes( 'ROLE_ADMIN' )){
       this.toAdmin = true;
    } else {
     this.toAdmin = false;
    }
  }

  ngOnInit(): void {

  }

}
