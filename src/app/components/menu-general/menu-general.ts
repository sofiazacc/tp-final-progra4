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

  menuItems = [
    {icon: 'dynamic_feed', label: 'Feed', route: ''},
    {icon: 'map_search', label: 'Mapa', route: ''},
    {icon: 'person', label: 'Perfil', route: ''},
    {icon: 'bookmark', label: 'Posts guardados', route: ''},
    {icon: 'account_circle_off', label: 'Cerrar sesión', route: ''},
  ]

}
