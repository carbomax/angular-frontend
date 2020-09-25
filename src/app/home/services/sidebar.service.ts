import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  storeMenu: any = [
    {
      title: 'Almacén',
      icon: 'fas fa-warehouse',
      subtitle: 'Productos',
      divider: 'sidebar-divider',
      submenu: [
        { title: 'Listar productos', url: '/home/store' }
      ]
    },
    {
      title: 'Mis productos',
      icon: 'fas fa-store',
      subtitle: 'Mis productos',
      divider: 'sidebar-divider',
      submenu: [
        { title: 'Mis productos', url: '/home/marketplaces' }        
      ]
    },
    {
      title: 'Ventas',
      icon: 'fas fa-dollar-sign fa-4x ml-2',
      subtitle: 'Ventas',
      divider: 'sidebar-divider',
      submenu: [
        { title: 'Listado de ventas', url: '#' }
      ]
    },
    {
      title: 'Administración',
      icon: 'fas fa-user-lock',
      subtitle: 'Panel',
      divider: 'sidebar-divider',
      submenu: [
        { title: 'Administración', url: '#' },
        { title: 'Marketplaces', url: '/home/list-marketplaces' }
      ]
    }
  ];


  constructor() { }
}
