import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-menu-general',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu-general.html',
  styleUrl: './menu-general.css'
})
export class MenuGeneral {

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
    {icon: 'thumbnail_bar', label: 'Desplegar', route: ''},

  ]
}
