import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { GeorefService } from '../../services/georef';
import { AuthService } from '../../services/authService';
import { GeoRefProvincia } from '../../models/georefProvincia';
import { GeoRefLocalidad } from '../../models/georefLocalidad';
import { CommonModule } from '@angular/common';
import { Localidad, Provincia, PROVINCIAS_LOCALIDADES } from './reemplazoEnum';



@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.html',
  styleUrls: ['./auth.css']
})

export class Auth implements OnInit { 
   
  provincias = Object.values(Provincia);
  localidades: Localidad[] = [];
  
  constructor(
      private authService: AuthService,
      private georefService: GeorefService,
      private router: Router
    ) {}
/*
    //Variables para provincias y localidades
    provincias: GeoRefProvincia[] = [];
    localidades: GeoRefLocalidad[] = [];*/


  ngOnInit(): void { 
    /*this.georefService.getProvincias().subscribe(data => {
      console.log("Datos recibidos de provincias:", data);
      this.provincias = data.provincias.sort((a, b) => a.nombre.localeCompare(b.nombre)); // Se ordenan alfabéticamente las provincias
    }); */
  }



  cambioDeProvincia(event: any /*Event*/) { //Método para actualizar las localidades cuando cambia la provincia seleccionada
    const selectElement = event.target as HTMLSelectElement;
    const provinciaId = selectElement.value;
    /*
    if(provinciaId){
      this.georefService.getLocalidades(provinciaId).subscribe(data => {
      this.localidades = data.localidades.sort((a, b) => a.nombre.localeCompare(b.nombre)); // Se ordenan alfabéticamente las localidades
    });
    }else{
      this.localidades = []; // Si no hay provincia seleccionada, se limpia la lista de localidades 
    }

    this.registroForm.get('localidad')?.setValue(''); // Resetea el valor del select de localidades al cambiar la provincia*/
     const provinciaSeleccionada = event.target.value as Provincia;
    this.localidades = PROVINCIAS_LOCALIDADES[provinciaSeleccionada] || [];
  }


  esLogin = true

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    contra: new FormControl('', [Validators.required, Validators.minLength(8)])
  })

  registroForm = new FormGroup({
    nombre: new FormControl('', [Validators.required,Validators.pattern('^[a-zA-ZÁÉÍÓÚáéíóúÑñ]+$')]),
    apellido: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-ZÁÉÍÓÚáéíóúÑñ]+$')]),
    username: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9-]+$')]),
    localidad: new FormControl('', [Validators.required]),
    provincia: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]),
    contra: new FormControl('', [Validators.required, Validators.minLength(8)])
  })

  onLoginSubmit() {
    if (!this.loginForm.valid) {
       console.log("Formulario no válido");
      this.loginForm.markAllAsTouched();
      return;
    } 

    this.loginForm.get('email')?.setErrors(null);
   this.loginForm.get('contra')?.setErrors(null);

    const credenciales = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.contra!
    }

    
    this.authService.login(credenciales).subscribe({
      next: (respuesta) => {

        if(respuesta) {
          console.log("Login exitoso");

          alert(`Bienvenido, ${respuesta.user.nombre}!`);

          this.router.navigateByUrl('/feed');
        }
      },
      error: (error) => {
        console.error("LOGIN FALLIDO - Error recibido:", error);

        if(error.status === 404 && error.error.message){
          const mensajeError = error.error.message;
          if(mensajeError.includes('email')){
            this.loginForm.get('email')?.setErrors({'invalido': mensajeError});
          }
        }else if(error.status === 401 && error.error.message){
          const mensajeError = error.error.message;
          if(mensajeError.includes('contraseña')){
            this.loginForm.get('contra')?.setErrors({'invalido': mensajeError});
          }
        }else{
         console.error("Error durante el login", error);
         alert(`Ocurrió un error durante el login. Por favor, intente de nuevo más tarde.`);
      
        }
       }
    });
}




  onRegistroSubmit() {
    if (!this.registroForm.valid) {
      console.log("Formulario de registro no válido");
      this.registroForm.markAllAsTouched();
    return;
  }

   this.registroForm.get('email')?.setErrors(null);
   this.registroForm.get('username')?.setErrors(null);


    const formValue = this.registroForm.value;
/*
    const provinciaSeleccionada = this.provincias.find(
      p => p.id === formValue.provincia
    );
    const nombreProvincia = provinciaSeleccionada ? provinciaSeleccionada.nombre : '';*/
  

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

    this.authService.register(nuevoFotografo).subscribe({ 
      next: (respuesta) => {
        console.log("Registro exitoso", respuesta);

        alert(`Registro exitoso. Bienvenido, ${respuesta.user.nombre}!`);
        this.router.navigateByUrl('/feed');
        this.registroForm.reset();
        this.esLogin = true; // Cambia a la vista de login después del registro exitoso
      },
      error: (error) => {
        console.error("Error durante el registro", error);
        
        if (error.status === 400 && error.error.message) {
          const mensajeError = error.error.message;
          if (mensajeError.includes('email')) {
            this.registroForm.get('email')?.setErrors({ 'unico': mensajeError });
          } else if(mensajeError.includes('usuario')) {
             this.registroForm.get('username')?.setErrors({ 'unico': mensajeError });
          } else {
            alert(mensajeError); 
          }
      } else {
        alert(`Ocurrió un error inesperado. Por favor, intente de nuevo más tarde.`);
      }
    }
    });
  }

  //registro
  get reg(): { [key: string]: AbstractControl } {
    return this.registroForm.controls;
  }

  //login
  get log(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }
}
