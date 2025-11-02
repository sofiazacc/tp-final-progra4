import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormGroup, FormControl, Validators} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { GeorefService } from '../../services/georef';
import { AuthService } from '../../services/auth';

import { GeoRefProvincia } from '../../models/georef-provincia';
import { GeoRefLocalidad } from '../../models/georef-localidad';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})

export class Auth implements OnInit { //OnInit es un ciclo de vida de Angular que se ejecuta después de que el componente ha sido inicializado. Es útil para realizar tareas de configuración o inicialización que requieren que las propiedades del componente estén definidas.
    constructor(
      private authService: AuthService,
      private georefService: GeorefService
    ) {} 

    //Variables para provincias y localidades
    provincias: GeoRefProvincia[] = [];
    localidades: GeoRefLocalidad[] = [];

  ngOnInit(): void { //
    this.georefService.getProvincias().subscribe(data => {
      console.log("Datos recibidos de provincias:", data);
      this.provincias = data.provincias.sort((a, b) => a.nombre.localeCompare(b.nombre)); // Se ordenan alfabéticamente las provincias
    }); 
  }

  cambioDeProvincia(event: Event) { //Método para actualizar las localidades cuando cambia la provincia seleccionada
    const selectElement = event.target as HTMLSelectElement;
    const provinciaId = selectElement.value;
    
    if(provinciaId){
      this.georefService.getLocalidades(provinciaId).subscribe(data => {
      this.localidades = data.localidades.sort((a, b) => a.nombre.localeCompare(b.nombre)); // Se ordenan alfabéticamente las localidades
    });
    }else{
      this.localidades = []; // Si no hay provincia seleccionada, se limpia la lista de localidades 
    }

    this.registroForm.get('localidad')?.setValue(''); // Resetea el valor del select de localidades al cambiar la provincia
  }


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

    const formValue = this.registroForm.value;

   const provinciaSeleccionada = this.provincias.find(
      p => p.id === formValue.provincia
    );

    const nombreProvincia = provinciaSeleccionada ? provinciaSeleccionada.nombre : '';
    
    const nuevoFotografo = {
      nombre: formValue.nombre!,
      apellido: formValue.apellido!,
      email: formValue.email!,
      password: formValue.contra!,
      rol: 'fotografo' as const,
      nombreDeUsuario: formValue.username!,
      localidad: formValue.localidad!,
      provincia: formValue.provincia!
    };
}

}
