import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PosicionViaLactea } from '../../models/posicionViaLactea';
import { ViaLacteaServiceService } from '../../services/via-lactea-service';

@Component({
  selector: 'app-posicion-via-lactea',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './posicion-via-lactea.html',
  styleUrls: ['./posicion-via-lactea.css']
})
export class PosicionViaLacteaComponent {

  formulario: FormGroup;
  latitud: FormControl;
  longitud: FormControl;
  fecha: FormControl;
  hora: FormControl;

  posicionActual: PosicionViaLactea | null = null;
  mejorMomento: PosicionViaLactea | null = null;
  posicionesDia: PosicionViaLactea[] = [];
  
  mostrarAnalisisDia = false;

  constructor(private calculadora: ViaLacteaServiceService) {
    // Inicializar con valores de Mar del Plata por defecto
    this.latitud = new FormControl(-38.0055, [Validators.required, Validators.min(-90), Validators.max(90)]);
    this.longitud = new FormControl(-57.5426, [Validators.required, Validators.min(-180), Validators.max(180)]);
    
    // Fecha y hora actual por defecto
    const ahora = new Date();
    const fechaStr = ahora.toISOString().split('T')[0];
    const horaStr = ahora.toTimeString().slice(0, 5);
    
    this.fecha = new FormControl(fechaStr, Validators.required);
    this.hora = new FormControl(horaStr, Validators.required);

    this.formulario = new FormGroup({
      latitud: this.latitud,
      longitud: this.longitud,
      fecha: this.fecha,
      hora: this.hora
    });
  }

  calcularPosicionActual() {
    if (this.formulario.invalid) {
      return;
    }

    const lat = Number(this.latitud.value);
    const lng = Number(this.longitud.value);
    const fechaStr = this.fecha.value;
    const horaStr = this.hora.value;

    // Combinar fecha y hora
    const fechaHora = new Date(`${fechaStr}T${horaStr}`);

    this.posicionActual = this.calculadora.calcularPosicion(lat, lng, fechaHora);
    this.mostrarAnalisisDia = false;
  }

  analizarDiaCompleto() {
    if (this.formulario.invalid) {
      return;
    }

    const lat = Number(this.latitud.value);
    const lng = Number(this.longitud.value);
    const fechaStr = this.fecha.value;
    
    const fecha = new Date(`${fechaStr}T00:00:00`);

    this.posicionesDia = this.calculadora.calcularDiaCompleto(lat, lng, fecha);
    this.mejorMomento = this.calculadora.encontrarMejorMomento(lat, lng, fecha);
    this.mostrarAnalisisDia = true;
  }

  obtenerEvaluacion(posicion: PosicionViaLactea): string {
    return this.calculadora.evaluarVisibilidad(posicion);
  }

  usarUbicacionActual() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitud.setValue(position.coords.latitude);
          this.longitud.setValue(position.coords.longitude);
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
          alert('No se pudo obtener la ubicación. Verifica los permisos del navegador.');
        }
      );
    } else {
      alert('Tu navegador no soporta geolocalización.');
    }
  }

  get altitudColor(): string {
    if (!this.posicionActual) return 'gray';
    const alt = this.posicionActual.altitud;
    if (alt < 0) return '#e74c3c';      // Rojo - no visible
    if (alt < 15) return '#e67e22';     // Naranja - muy bajo
    if (alt < 30) return '#f39c12';     // Amarillo - bajo
    if (alt < 60) return '#2ecc71';     // Verde - bueno
    return '#27ae60';                    // Verde oscuro - excelente
  }
}