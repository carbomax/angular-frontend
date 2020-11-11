import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {



  constructor(private router: Router, public authService: AuthService) {

   }

  ngOnInit(): void {
    this.authService.authenticationDataExtrac();

  }


  public logout(): void {
    this.authService.logout();
    this.router.navigate(['auth/login']);
  }
}
