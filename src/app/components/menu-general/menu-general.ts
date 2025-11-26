import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from '../../services/authService';
import { routes } from '../../app.routes';

@Component({
  selector: 'app-menu-general',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu-general.html',
  styleUrl: './menu-general.css'
})
export class MenuGeneral {

  constructor(private authService : AuthService){};

  desplegado = true;

  desplegarContraer(){
    this.desplegado = !this.desplegado
  }

  itemBoton = {icon: 'thumbnail_bar', label: 'Desplegar', route: ''}

  menuItems = [
    {icon: 'dynamic_feed', label: 'Feed', route: 'feed'},
    {icon: 'map_search', label: 'Mapa', route: 'mapa'},
    {icon: 'person', label: 'Perfil', route: 'perfil'},
    {icon: 'bookmark', label: 'Posts guardados', route: 'guardados'},
    {icon: 'account_circle_off', label: 'Cerrar sesión', route: 'auth'},
    {icon: 'thumbnail_bar', label: 'Eventos', route: 'eventos'},
    {icon: 'thumbnail_bar', label: 'Regla del 500', route: 'calculadora'},
    {icon: 'thumbnail_bar', label: 'Horas mágicas', route: 'calculadora2'},
    {icon: 'thumbnail_bar', label: 'Vía Láctea', route: 'viaLactea'}
  ]

  verificarAccion(item: any) {
 
    if (item.label === 'Cerrar sesión') {
      this.authService.cerrarSesion();
    }
  }
}
