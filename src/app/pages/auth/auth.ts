import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router} from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { GeorefService } from '../../services/georef';
import { AuthService } from '../../services/authService';
import { GeoRefProvincia } from '../../models/georef-provincia';
import { GeoRefLocalidad } from '../../models/georef-localidad';


@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [AuthService, GeorefService],
  templateUrl: './auth.html',
  styleUrls: ['./auth.css']
})

export class Auth implements OnInit { 
    constructor(
      private authService: AuthService,
      private georefService: GeorefService,
      private router: Router
    ) {}

    //Variables para provincias y localidades
    provincias: GeoRefProvincia[] = [];
    localidades: GeoRefLocalidad[] = [];

  ngOnInit(): void { 
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
    if (!this.loginForm.valid) {
       console.log("Formulario no válido");
      this.loginForm.markAllAsTouched();
      return;
    } else {
      console.log("Formulario no válido");
    }

    const credenciales = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.contra!
    }

    
    this.authService.login(credenciales).subscribe({
      next: (respuesta) => {

        if(respuesta) {
          console.log("Login exitoso");

          alert(`Bienvenido, ${respuesta.user.nombre}!`);

          this.router.navigate(['/feed']);
        }
      },
      error: (error) => {
        console.error("Error durante el login", error);
        alert(`Ocurrió un error durante el login. Por favor, intente de nuevo más tarde.`);
      }
    });
}

  onRegistroSubmit() {
    if (!this.registroForm.valid) {
      console.log("Formulario de registro no válido");
      this.registroForm.markAllAsTouched();
    return;
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
      provincia: provinciaSeleccionada ? provinciaSeleccionada.nombre : '' 
    };

    this.authService.register(nuevoFotografo).subscribe({
      next: (respuesta) => {
        console.log("Registro exitoso", respuesta);

        this.authService.guardarToken(respuesta.accessToken);
        this.authService.guardarUsuario(respuesta.user);

        
        alert(`Registro exitoso. Bienvenido, ${respuesta.user.nombre}!`);
        this.router.navigate(['/feed']);
        this.esLogin = true; // Cambia a la vista de login después del registro exitoso
      },
      error: (error) => {
        console.error("Error durante el registro", error);
        alert(`Ocurrió un error durante el registro. Por favor, intente de nuevo más tarde.`);
      }
    });
}

}
