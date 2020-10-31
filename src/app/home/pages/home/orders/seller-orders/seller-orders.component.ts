import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-seller-orders',
  templateUrl: './seller-orders.component.html',
  styleUrls: ['./seller-orders.component.css']
})
export class SellerOrdersComponent implements OnInit {

orders: any [] = []
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('http://localhost:9999/pepeganga/meli/api/orders/by-all-profile-accounts/22?page=0&size=1')
    .subscribe( (resp: any) => {
      this.orders = resp
      console.log(this.orders)
    });
  }

}
