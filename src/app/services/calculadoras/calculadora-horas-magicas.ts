import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SunriseSunsetApiResponse } from '../../models/sunriseSunsetApiResponse';
import { HorasMagicasModel } from '../../models/horasMagicasModel';


@Injectable({
  providedIn: 'root'
})
export class CalculadoraHorasMagicas {

  private URL = 'https://api.sunrise-sunset.org/json';

  constructor(private http: HttpClient) {}

  getHorasMagicas(lat: number, lng: number, date: string): Observable<HorasMagicasModel> {

    return this.http.get<SunriseSunsetApiResponse>(
      `${this.URL}?lat=${lat}&lng=${lng}&date=${date}&formatted=0&tzid=America/Argentina/Buenos_Aires`
    )
    .pipe(
      map(response => {

        const r = response.results;

        // La API devuelve ISO 8601: permite el funcionamiento de Date()
        const amanecer = new Date(r.sunrise);
        const atardecer = new Date(r.sunset);

        const civilBegin = new Date(r.civil_twilight_begin);
        const civilEnd = new Date(r.civil_twilight_end);

        // HORA AZUL

        // AM = civil_twilight_begin -> sunrise
        const inicioAzulAM = civilBegin;
        const finAzulAM = amanecer;

        // PM = sunset -> civil_twilight_end
        const inicioAzulPM = atardecer;
        const finAzulPM = civilEnd;

        // HORA DORADA  
        const MIN20 = 20 * 60 * 1000;

        // AM = amanecer -> +20 min
        const inicioDoradaAM = amanecer;
        const finDoradaAM = new Date(amanecer.getTime() + MIN20);

        // PM = atardecer -20 min -> atardecer
        const inicioDoradaPM = new Date(atardecer.getTime() - MIN20);
        const finDoradaPM = atardecer;

        return {
          amanecer,
          atardecer,
          horaAzulAM_Inicio: inicioAzulAM,
          horaAzulAM_Fin: finAzulAM,
          horaAzulPM_Inicio: inicioAzulPM,
          horaAzulPM_Fin: finAzulPM,
          horaDoradaAM_Inicio: inicioDoradaAM,
          horaDoradaAM_Fin: finDoradaAM,
          horaDoradaPM_Inicio: inicioDoradaPM,
          horaDoradaPM_Fin: finDoradaPM
        };

      })
    );
  }
}
