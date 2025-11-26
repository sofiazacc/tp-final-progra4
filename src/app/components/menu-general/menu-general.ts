import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from '../../services/authService';
import { routes } from '../../app.routes';

@Component({
  selector: 'app-menu-general',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu-general.html',
  styleUrl: './menu-general.css'
})
export class MenuGeneral implements OnInit{

  constructor(private authService : AuthService){};

  desplegado = true;

  esAdmin = false;
  esFotografo = false;

  menuItems: Array<{icon: string, label: string, route: string}> = []

  ngOnInit(): void {

    const usuario = this.authService.getUsuarioLogueado();
    
    if(usuario!.rol === 'admin'){
      this.menuItems = 
      [
        {icon: 'supervised_user_circle', label: 'Usuarios', route: 'usuarios-admin'},
        {icon: 'format_image_right', label: 'Posteos', route: 'posts-admin'}
      ]
    }else{
      this.menuItems = 
      [
        {icon: 'dynamic_feed', label: 'Feed', route: 'feed'},
        {icon: 'map_search', label: 'Mapa', route: 'mapa'},
        {icon: 'person', label: 'Perfil', route: 'perfil'},
        {icon: 'bookmark', label: 'Posts guardados', route: 'guardados'},
        {icon: 'account_circle_off', label: 'Cerrar sesión', route: 'auth'},
        {icon: 'orbit', label: 'Eventos', route: 'eventos'},
        {icon: 'calculate', label: 'Regla del 500', route: 'calculadora'},
        {icon: 'wb_twilight', label: 'Horas mágicas', route: 'calculadora2'},
        {icon: 'planet', label: 'Vía Láctea', route: 'viaLactea'}
      ]
    }
  }

  desplegarContraer(){
    this.desplegado = !this.desplegado
  }

  itemBoton = {icon: 'thumbnail_bar', label: 'Desplegar', route: ''}

 

  verificarAccion(item: any) {
 
    if (item.label === 'Cerrar sesión') {
      this.authService.cerrarSesion();
    }
  }
}
