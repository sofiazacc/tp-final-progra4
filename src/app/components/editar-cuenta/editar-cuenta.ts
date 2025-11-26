import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/authService';
import { Fotografo } from '../../models/usuario';

@Component({
  selector: 'app-editar-cuenta',
  imports: [ReactiveFormsModule],
  templateUrl: './editar-cuenta.html',
  styleUrl: './editar-cuenta.css',
})
export class EditarCuenta implements OnInit{

  @Output() onGoToMail = new EventEmitter<void>();
  @Output() onGoToPassword = new EventEmitter<void>();

  formulario: FormGroup
  fotografo: Fotografo | null = null

  constructor(
      private fb: FormBuilder,
      private authService: AuthService,
    ){
  
      this.formulario = fb.group({
        id: this.fotografo?.id,
        password: this.fotografo?.password,
        email: this.fotografo?.email,

      })
  
    }
  
    ngOnInit(): void {
  
      this.obtenerUsuario()
      if(this.fotografo){
        this.formulario.patchValue({
          id: this.fotografo.id,
          password: this.fotografo.password,
          email: this.fotografo.email
        })
      }
      this.actualizarDatos()
    }

    obtenerUsuario(){
    const usuarioLogueado = this.authService.getfotografoActual();

    if(usuarioLogueado){
      this.fotografo = usuarioLogueado
    }else{
      console.error("No hay un usuario logueado")
    }
  }

  actualizarDatos() {
    if (this.fotografo) {
      this.formulario.patchValue({
        password: 'xxxxxxxxxxxxxxxx', 
        
        email: this.enmascararEmail(this.fotografo.email)
      });
    }
  }

  enmascararEmail(email: string): string {
    if (!email) return '';
    
    const partes = email.split('@');
    if (partes.length < 2) return email;

    const nombre = partes[0];
    const dominio = partes[1];

    const nombreVisible = nombre.length > 3 ? nombre.substring(0, 3) : nombre;
    
    const puntoIndex = dominio.lastIndexOf('.');
    const extension = puntoIndex !== -1 ? dominio.substring(puntoIndex) : '';
    
    return `${nombreVisible}****@****${extension}`;
  }

}
