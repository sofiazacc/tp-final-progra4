import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/authService';
import { Fotografo } from '../../models/usuario';


@Component({
  selector: 'app-perfil',
  imports: [],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil{

  fotografo: Fotografo | null

  constructor(public authService: AuthService){
    this.fotografo = this.authService.getfotografoActual()
    console.log("Datos en LocalStorage:", localStorage.getItem('usuario_logueado'));
    console.log("Fotógrafo parseado:", this.fotografo);
  }

  modificarPerfil(){
    
  }

}