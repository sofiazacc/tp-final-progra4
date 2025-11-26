import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/authService';
import { Fotografo } from '../../models/usuario';
import { ModalEditarPerfil } from '../../components/modal-editar-perfil/modal-editar-perfil';


@Component({
  selector: 'app-perfil',
  imports: [ModalEditarPerfil],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil{

  fotografo: Fotografo | null
  estadoModal: boolean = false

  constructor(public authService: AuthService){
    this.fotografo = this.authService.getfotografoActual()
    console.log("Datos en LocalStorage:", localStorage.getItem('usuario_logueado'));
    console.log("Fotógrafo parseado:", this.fotografo);
  }

  modificarPerfil(){
    this.estadoModal = true
  }

  cerrarModal(){
    this.estadoModal = false
    this.fotografo = this.authService.getfotografoActual();
  }

}