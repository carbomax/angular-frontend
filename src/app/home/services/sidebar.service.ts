import { Injectable } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { RoleEnum } from '../../enums/role.enum';

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
        { title: 'Listar productos', url: '/home/store', roles: [RoleEnum.ADMIN, RoleEnum.SELLER, RoleEnum.INVITED]}
      ]
    },
    {
      title: 'Mis productos',
      icon: 'fas fa-store',
      subtitle: 'Mis productos',
      divider: 'sidebar-divider',
      submenu: [
        { title: 'Mis productos', url: '/home/marketplaces' , roles: [RoleEnum.ADMIN, RoleEnum.SELLER]},
        { title: 'Productos Publicados', url: '/home/published-products', roles: [RoleEnum.ADMIN, RoleEnum.SELLER] }
      ]
    },
    {
      title: 'Ventas',
      icon: 'fas fa-dollar-sign ml-2',
      subtitle: 'Ventas',
      divider: 'sidebar-divider',
      submenu: [
        { title: 'Órdenes', url: '/home/seller-orders' , roles: [RoleEnum.ADMIN, RoleEnum.SELLER]},
        { title: 'Operaciones', url: '/home/operations' , roles: [RoleEnum.ADMIN, RoleEnum.OPERATOR]},
        { title: 'Histórico-Operaciones', url: '/home/historical-operations' , roles: [RoleEnum.ADMIN, RoleEnum.OPERATOR]}
      ],
    },
    {
      title: 'Administración',
      icon: 'fas fa-user-lock',
      subtitle: 'Panel',
      divider: 'sidebar-divider',
      submenu: [
        { title: 'Usuarios', url: '/home/users-admin', roles: [RoleEnum.ADMIN] },
        { title: 'Vendedores', url: '/home/sellers' , roles: [RoleEnum.ADMIN]},
        { title: 'Márgenes', url: '/home/margins', roles: [RoleEnum.ADMIN, RoleEnum.SELLER] },
        { title: 'Marketplaces', url: '/home/list-marketplaces' , roles: [RoleEnum.ADMIN]},
        { title: 'Cuentas Mercado Libre', url: '/home/meli-accounts' , roles: [RoleEnum.ADMIN, RoleEnum.SELLER]},
        { title: 'Configuración del sistema', url: '/home/configuration' , roles: [RoleEnum.ADMIN]}
      ]
    }
  ];


  constructor(public authService: AuthService) { }

  hashRoles(roles?: string[]): boolean {
    return this.authService.hasRole(roles);
  }
}
