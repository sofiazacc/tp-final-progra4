import { Component } from '@angular/core';

import { FormGroup, FormControl, Validators} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    contra: new FormControl('', [Validators.required, Validators.minLength(8)])
  })

  onSubmit() {
    if (this.loginForm.valid) {
      console.log("Formulario enviado correctamente", this.loginForm.value);
    } else {
      console.log("Formulario no válido");
    }
  }
}
