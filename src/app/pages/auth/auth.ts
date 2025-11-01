import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormGroup, FormControl, Validators} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})

export class Auth {

  esLogin = true

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    contra: new FormControl('', [Validators.required, Validators.minLength(8)])
  })

  registroForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    apellido: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    ciudadDeOrigen: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    contra: new FormControl('', [Validators.required, Validators.minLength(8)])
  })

  onLoginSubmit() {
    if (this.loginForm.valid) {
      console.log("Formulario enviado correctamente", this.loginForm.value);
    } else {
      console.log("Formulario no válido");
    }
  }

  onRegistroSubmit() {
    if (this.registroForm.valid) {
      console.log("Formulario de registro enviado correctamente", this.registroForm.value);
    } else {
      console.log("Formulario de registro no válido");
    }
}

}
