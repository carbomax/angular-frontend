import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {
  multi: any[];
  view: any[] = [undefined, 400];

  // options
  gradient: boolean = true;
  legend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
 // xAxisLabel: string = 'Años';
  //yAxisLabel: string = 'Population';
  timeline: boolean = true;

  colorScheme = {
    domain: ['#5AA454']
  };

  constructor() {
    Object.assign(this, { multi });
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  ngOnInit(): void {
  }

}

export var multi = [


  {
    "name": "Ventas",
    "series": [
      {
        "name": "1990",
        "value": 20
      },
      {
        "name": "1991",
        "value": 20
      },
      {
        "name": "1992",
        "value": 33
      },
      {
        "name": "1995",
        "value": 33
      },
      {
        "name": "2000",
        "value": 90
      },
      {
        "name": "2010",
        "value": 30
      },
      {
        "name": "2015",
        "value": 90
      },
      {
        "name": "2016",
        "value": 30
      }
    ]
  }
];
