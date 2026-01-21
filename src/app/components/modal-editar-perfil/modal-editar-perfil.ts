import { Component, EventEmitter, Output } from '@angular/core';
import { EditarPerfil } from '../editar-perfil/editar-perfil';
import { EditarCuenta } from '../editar-cuenta/editar-cuenta';
import { CambiarMail } from '../cambiar-mail/cambiar-mail';
import { CambiarContrasenia } from '../cambiar-contrasenia/cambiar-contrasenia';

type Vista = "Perfil" | "Cuenta" | "Email" | "Eliminar" | "Password"

@Component({
  selector: 'app-modal-editar-perfil',
  imports: [EditarPerfil, EditarCuenta, CambiarMail, CambiarContrasenia],
  templateUrl: './modal-editar-perfil.html',
  styleUrl: './modal-editar-perfil.css',
})
export class ModalEditarPerfil {

  @Output() onClose = new EventEmitter<void>();

  // variable de estado
  vistaActual: Vista = "Perfil"

  cambiarVista(vista: Vista){
    this.vistaActual = vista
  }

  cerrar(){
    this.onClose.emit();
    this.vistaActual = "Perfil"
  }

}
