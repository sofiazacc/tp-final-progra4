import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CalculadoraHorasMagicas } from '../../services/calculadoras/calculadora-horas-magicas';
import { CommonModule } from '@angular/common';
import { AnimacionSolLuna } from '../../animaciones/animacion-sol-luna/animacion-sol-luna';

@Component({
  selector: 'app-calculadora-horas-magicas',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, AnimacionSolLuna],
  templateUrl: './caculadora-horas-magicas-component.html',
  styleUrls: ['./caculadora-horas-magicas-component.css']
})
export class CaculadoraHorasMagicasComponent {

  formulario: FormGroup;
  latitud: FormControl;
  longitud: FormControl;
  fecha: FormControl;

  // resultados del cálculo
  resultado: any = null;  

  cargando = false;
  error = '';

  constructor(private calculadoraMagicas: CalculadoraHorasMagicas){

    this.latitud = new FormControl('');
    this.longitud = new FormControl('');
    this.fecha = new FormControl('');

    this.formulario = new FormGroup({
      latitud: this.latitud,
      longitud: this.longitud,
      fecha: this.fecha
    });
  }

  calcular(){
    this.error = '';
    this.resultado = null;

    const lat = Number(this.latitud.value);
    const lng = Number(this.longitud.value);
    const date = this.fecha.value;

    if(!lat || !lng || !date){
      this.error = "Complete todos los campos.";
      return;
    }

    this.cargando = true;

    this.calculadoraMagicas.getHorasMagicas(lat, lng, date)
      .subscribe({
        next: (res) => {
          this.resultado = res;
          this.cargando = false;
        },
        error: () => {
          this.error = "Ocurrió un error al obtener los datos.";
          this.cargando = false;
        }
      });
  }
}
