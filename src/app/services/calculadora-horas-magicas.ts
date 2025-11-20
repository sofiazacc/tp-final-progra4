import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HorasMagicasModel } from '../models/horasMagicasModel';

@Injectable({
  providedIn: 'root'
})
export class CalculadoraHorasMagicas {

  private URL = "https://api.sunrise-sunset.org/json"

  constructor(private http: HttpClient) {}

  // Idea de diseño a partir de la variabilidad del factor a sumar, para la obtencion de las horas doradas.
  // FactorDoradas = abs(inicioHoraAzul - Atardecer)
  // inicioHoraDorada = atardecer - factorDoradas

  getHorasMagicas(lat: number, lng: number, date: string): Observable<HorasMagicasModel>{
    const url = `${this.URL}?lat=${lat}&lng=${lng}&date=${date}&formatted=0`;
    
    return this.http.get<any>(url).pipe(
      map(response => {             //mapeo de valores devueltos por la API
        const r = response.results;
        return {
          amanecer: new Date(r.sunrise),
          atardecer: new Date(r.sunset),
          inicioHoraAzul: new Date(r.civil_twilight_begin),
          finHoraAzul: new Date(r.civil_twilight_end),
          inicioHoraDorara: new Date(r.sunset), // ¡Restar 20 min!
          finHoraDorada: new Date(r.sunrise) // ¡Sumar 20 min!
        } as HorasMagicasModel;

      })
    );
  }
}