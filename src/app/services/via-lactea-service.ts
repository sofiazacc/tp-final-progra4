import { Injectable } from '@angular/core';
import * as Astronomy from 'astronomy-engine';
import { PosicionViaLactea } from '../models/posicionViaLactea';
import { CalculadoraHorasMagicas } from './calculadoras/calculadora-horas-magicas';

@Injectable({
  providedIn: 'root'
})
export class ViaLacteaServiceService {

  constructor(private horasMagicas: CalculadoraHorasMagicas) {}


  calcularPosicion(latitud: number, longitud: number, fecha?: Date): PosicionViaLactea {
    const fechaBase = fecha ?? new Date(); // el "??" devuelve el lado derecho sólo si el izquierdo es undefined o null
    
    const fechaUTC = new Date(Date.UTC(    //convierte la fecha al formato UTC (usado en los cálculos)
      fechaBase.getUTCFullYear(),
      fechaBase.getUTCMonth(),
      fechaBase.getUTCDate(),
      fechaBase.getUTCHours(),
      0, 0, 0                              // Minutos, segundos y milisegundos en 0
    ));

    // El 0 indica la altura sobre el nivel del mar. 0 es una altura decente para el 99% de los casos incluso
    // para la cima del Everest, puesto que sólo influye en el índice de refracción, pudiendo variar hasta 0.5°, que resulta despreciable
    const observador = new Astronomy.Observer(latitud, longitud, 0);   // Representa mi posición en la Tierra

    // Coordenadas del centro galáctico (Sagittarius A*)
    const centro_galactico_RA = 17.7611;   // Ascensión recta en horas
    const centro_galactico_DEC = -29.0078; // Declinación en grados

    //hor = horizontal (coordenadas horizontales)
    const hor = Astronomy.Horizon(fechaUTC, observador, centro_galactico_RA, centro_galactico_DEC, 'normal');

    return {
      azimut: +(hor.azimuth.toFixed(2)),  //toFixed: 2 decimales, parseado a string. El '+' lo parsea a number
      altitud: +(hor.altitude.toFixed(2)),
      visible: hor.altitude > 0,
      direccionCardinal: this.obtenerDireccionCardinal(hor.azimuth),
      horaCalculo: fechaUTC,
      esDeNoche: false
    };
  }

  calcularDiaCompleto(latitud: number, longitud: number, fecha: Date): PosicionViaLactea[] {
    const fechaUTC = new Date(Date.UTC(
      fecha.getUTCFullYear(),
      fecha.getUTCMonth(),
      fecha.getUTCDate(),
      0, 0, 0, 0                // Hora 00:00:00.000
    ));

    const observador = new Astronomy.Observer(latitud, longitud, 0);
    const { amanecer, atardecer } = this.calcularHorasSolares(observador, fechaUTC);

    const posiciones: PosicionViaLactea[] = [];

    for (let hora = 0; hora < 24; hora++) {
      const fechaHoraUTC = new Date(Date.UTC(
        fechaUTC.getUTCFullYear(),
        fechaUTC.getUTCMonth(),
        fechaUTC.getUTCDate(),
        hora + 3, 0, 0, 0,  // El uso del formato universal UTC requiere la suma de 3 horas para lograr una visualización apropiada de las 24 horas del día
      ));

      const pos = this.calcularPosicion(latitud, longitud, fechaHoraUTC);

      if (amanecer && atardecer) {
        const t = fechaHoraUTC.getTime();
        pos.esDeNoche = t >= atardecer.date.getTime() || t <= amanecer.date.getTime();
      }

      posiciones.push(pos);
    }

    return posiciones;
  }

  encontrarMejorMomento(latitud: number, longitud: number, fecha: Date): PosicionViaLactea | null {
    const fechaUTC = new Date(Date.UTC(
      fecha.getUTCFullYear(),
      fecha.getUTCMonth(),
      fecha.getUTCDate(),
      0, 0, 0, 0
    ));

    const observador = new Astronomy.Observer(latitud, longitud, 0);
    const { amanecer, atardecer } = this.calcularHorasSolares(observador, fechaUTC);

    if (!amanecer || !atardecer) return null;

    const posiciones = this.calcularDiaCompleto(latitud, longitud, fechaUTC);

    const nocturnas = posiciones.filter(pos => 
      pos.esDeNoche && pos.visible
    );

    return nocturnas.length === 0 
      ? null 
      : nocturnas.reduce((mejor, actual) => actual.altitud > mejor.altitud ? actual : mejor);
  }

   private calcularHorasSolares(observador: Astronomy.Observer, fecha: Date) {
     return {
       amanecer: Astronomy.SearchRiseSet(Astronomy.Body.Sun, observador, 1, fecha, 1),
       atardecer: Astronomy.SearchRiseSet(Astronomy.Body.Sun, observador, -1, fecha, 1)
     };
   }

  // private calcularHorasSolares(observador: Astronomy.Observer, fecha: Date){
  //   const fechaString = fecha.toISOString().split('T')[0];
  //   return this.horasMagicas.getHorasMagicas(observador.latitude, observador.longitude, fechaString)
  // }

  private obtenerDireccionCardinal(azimut: number): string {
    const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSO','SO','OSO','O','ONO','NO','NNO'];
    return dirs[Math.round(azimut / 22.5) % 16];
  }

  evaluarVisibilidad(posicion: PosicionViaLactea): string {
    if (posicion.altitud < 0) return 'No visible (bajo el horizonte)';
    if (posicion.altitud < 15) return 'Muy baja (difícil de fotografiar)';
    if (posicion.altitud < 30) return 'Baja (posible con horizonte despejado)';
    if (posicion.altitud < 60) return 'Buena altura (excelente)';
    return 'Muy alta (ideal)';
  }
}