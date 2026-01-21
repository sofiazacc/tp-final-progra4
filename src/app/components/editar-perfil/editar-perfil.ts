import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios-service';
import { AuthService } from '../../services/authService';
import { Fotografo, Usuario } from '../../models/usuario';

@Component({
  selector: 'app-editar-perfil',
  imports: [ReactiveFormsModule],
  templateUrl: './editar-perfil.html',
  styleUrl: './editar-perfil.css',
})
export class EditarPerfil implements OnInit{

  @Output() onGoToAccount = new EventEmitter<void>();
  @Output() onSaveSuccess = new EventEmitter<void>();
  
  formulario: FormGroup
  fotografo: Fotografo | null = null
  

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private usuarioService: UsuariosService
  ){

    this.formulario = fb.group({
      id: [''],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      nombreDeUsuario: ['', [Validators.required]],
    })

  }

  ngOnInit(): void {
    this.obtenerUsuario();

    if(this.fotografo){
      this.formulario.patchValue({
        id: this.fotografo.id,
        nombre: this.fotografo.nombre,
        apellido: this.fotografo.apellido,
        nombreDeUsuario: this.fotografo.nombreDeUsuario,
      })
    }
  }

  obtenerUsuario(){
    const usuarioLogueado = this.authService.getfotografoActual();

    if(usuarioLogueado){
      this.fotografo = usuarioLogueado
    }else{
      console.error("No hay un usuario logueado")
    }
  }

  guardar(){
    const fotografoActualizado = {
      ...this.fotografo,
      ...this.formulario.value
    }

    console.log("Lo que se envía: " + fotografoActualizado)


    this.usuarioService.modificarUsuario(fotografoActualizado).subscribe({
      next: (data) => {
        console.log(data);
        this.authService.guardarUsuario(data)
        alert("Datos guardados correctamente")
        this.onSaveSuccess.emit()
      },
      error: (e) => {
        console.error(e)
      }
    })
  }

}
