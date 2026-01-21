import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/authService';
import { Fotografo } from '../../models/usuario';
import { UsuariosService } from '../../services/usuarios-service';

@Component({
  selector: 'app-cambiar-mail',
  imports: [ReactiveFormsModule],
  templateUrl: './cambiar-mail.html',
  styleUrl: './cambiar-mail.css',
})
export class CambiarMail implements OnInit{

  @Output() onSaveSuccess = new EventEmitter<void>();
  @Output() onBack = new EventEmitter<void>();

  formulario: FormGroup
  fotografo: Fotografo | null = null
  

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private usuarioService: UsuariosService
  ){

    this.formulario = fb.group({
      email: ['', [Validators.required, Validators.email]],
      nuevoEmail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })

  }

  ngOnInit(): void {
    this.obtenerUsuario();
  }

  obtenerUsuario(){
    const usuarioLogueado = this.authService.getfotografoActual();

    if(usuarioLogueado){
      this.fotografo = usuarioLogueado
    }else{
      console.error("No hay un usuario logueado")
    }
  }

  cambiarEmail(){

    if(!this.fotografo){
      console.error("No se puede cambiar el email: Datos de fotógrafo faltantes.");
      alert("Error de sesión: Intente iniciar sesión nuevamente.");
      return;
    }

    const idFotografo = this.fotografo.id.toString();
    const password = this.formulario.get('password')?.value
    const nuevoEmail = this.formulario.get('nuevoEmail')?.value;

    this.authService.verificarPassword(idFotografo, password).subscribe({
      next: (data) => {
        if(data.valid){
          this.guardarNuevoEmail(idFotografo, nuevoEmail)
        }else{
          alert("La contraseña ingresada es incorrecta")
        }
      },
      error: (e) => {
        console.error(e);
      }
    })
  }

  guardarNuevoEmail(id: string, nuevoMail: string){
    const datosActualizados = {
      ...this.fotografo,
      id: id,
      email: nuevoMail
    } as Fotografo

    this.usuarioService.modificarUsuario(datosActualizados).subscribe({
      next: (data) => {
        console.log("Email cambiado:", data);
            
            this.authService.guardarUsuario(data);
            
            alert("Email actualizado correctamente");
            this.onSaveSuccess.emit()
      },
      error: (e) => {
        console.error(e);
      }
    })
  }



}
