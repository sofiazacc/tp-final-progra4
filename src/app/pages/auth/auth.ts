import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormGroup, FormControl, Validators} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { GeorefService } from '../../services/georef';
import { AuthService } from '../../services/auth';
@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})

export class Auth {
    constructor(
      private authService: AuthService,
      private georefService: GeorefService
    ) {} 

  esLogin = true

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    contra: new FormControl('', [Validators.required, Validators.minLength(8)])
  })

  registroForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    apellido: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    localidad: new FormControl('', [Validators.required]),
    provincia: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    contra: new FormControl('', [Validators.required, Validators.minLength(8)])
  })

  onLoginSubmit() {
    if (this.loginForm.valid) {
      console.log("Formulario enviado correctamente", this.loginForm.value);
    } else {
      console.log("Formulario no válido");
    }

    const credenciales = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.contra
    }

    this.authService.login(credenciales.email!, credenciales.password!).subscribe({
      next: (usuarios) => {

        if(usuarios && usuarios.length > 0) {
          console.log("Login exitoso", usuarios[0]);

          alert(`Bienvenido, ${usuarios[0].nombre}!`);
        }else{
        console.log("Login fallido: credenciales inválidas");
        alert(`Credenciales inválidas. Por favor, intente de nuevo.`);
        }
      },
      error: (error) => {
        console.error("Error durante el login", error);
        alert(`Ocurrió un error durante el login. Por favor, intente de nuevo más tarde.`);
      }
    });
}

  onRegistroSubmit() {
    if (this.registroForm.valid) {
      console.log("Formulario de registro enviado correctamente", this.registroForm.value);
    } else {
      console.log("Formulario de registro no válido");
    }


}

}
