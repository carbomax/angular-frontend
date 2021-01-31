import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-profile',
  templateUrl: './account-profile.component.html',
  styleUrls: ['./account-profile.component.css']
})
export class AccountProfileComponent implements OnInit {

  typePublications: any[] = [];
  selectedtypePublications: any[] = [];

  categories: any[] = [];
  selectedCategories: any[] = [];
  constructor() { }

  ngOnInit(): void {
  }

}
