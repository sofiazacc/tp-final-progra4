import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Fotografo } from '../../models/usuario';
import { AuthService } from '../../services/authService';
import { UsuariosService } from '../../services/usuarios-service';

@Component({
  selector: 'app-cambiar-contrasenia',
  imports: [ReactiveFormsModule],
  templateUrl: './cambiar-contrasenia.html',
  styleUrl: './cambiar-contrasenia.css',
})
export class CambiarContrasenia {

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
      password: ['', [Validators.required, Validators.minLength(8)]],
      nuevaPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmarPassword: ['', [Validators.required, Validators.minLength(8)]]
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

  cambiarPassword(){

    if(!this.fotografo){
      console.error("No se puede cambiar la contraseña: Datos de fotógrafo faltantes.");
      alert("Error de sesión: Intente iniciar sesión nuevamente.");
      return;
    }

    const idFotografo = this.fotografo.id.toString();
    const password = this.formulario.get('password')?.value
    const nuevaPassword = this.formulario.get('nuevaPassword')?.value
    const confirmarPassword = this.formulario.get('confirmarPassword')?.value

    if (password === nuevaPassword) {
        alert("La nueva contraseña no puede ser igual a la actual.");
        return;
    }
    if (nuevaPassword != confirmarPassword) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    this.authService.verificarPassword(idFotografo, password).subscribe({
      next: (data) => {
        if(data.valid){
          this.guardarNuevaPassword(idFotografo, nuevaPassword)
        }else{
          alert("La contraseña ingresada es incorrecta")
        }
      },
      error: (e) => {
        console.error(e);
      }
    })
  }

  guardarNuevaPassword(id: string, nuevaPassword: string){
    this.authService.cambiarPassword(id, nuevaPassword).subscribe({
      next: (usuarioActualizado) => {
        console.log("Contraseña cambiada exitosamente:", usuarioActualizado);
            
        this.authService.guardarUsuario(usuarioActualizado);
            
        alert("Contraseña actualizada correctamente");
        this.onSaveSuccess.emit();
      },
      error: (e) => {
        console.error("Error al cambiar password:", e);
        alert("No se pudo cambiar la contraseña.");
      }
    });
  }


}
