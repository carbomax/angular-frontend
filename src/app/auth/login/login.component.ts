import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

declare function initializePlugin();

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user: User;


  constructor(public router: Router, public authService: AuthService) {
    this.initialize();
  }

  ngOnInit(): void {
    initializePlugin();
  }

  login(): void {
    console.log(this.user)
    if (this.user.email !== '' && this.user.password !== '') {
      this.authService.login(this.user).subscribe( token => {
        console.log(token);
        this.router.navigate(['/home']);
      }, error => console.log(error))

    }
  }

  initialize(): void {
    this.user = new User();
  }

}
