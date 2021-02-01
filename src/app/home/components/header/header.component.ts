import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RoleEnum } from '../../../enums/role.enum';

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

  public isAdmin(): boolean {
    return this.authService.authenticationDataExtrac()?.roles.includes(RoleEnum.ADMIN);
  }


  public logout(): void {
    this.authService.logout();
    this.router.navigate(['auth/login']);
  }
}
