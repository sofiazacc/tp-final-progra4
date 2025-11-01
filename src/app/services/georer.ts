import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeoRefProvincia } from '../models/georef-provincia';
import { GeoRefLocalidad } from '../models/georef-localidad';

//Responses de la API
interface GeoRefProvinciasResponse {
  provincias: GeoRefProvincia[];
}

interface GeoRefLocalidadesResponse {
  localidades: GeoRefLocalidad[];
}

@Injectable({
  providedIn: 'root'
})

export class Georer {
  private apiUrl = 'https://www.argentina.gob.ar/api/georef';
  
  constructor(private http: HttpClient) {}

  getProvincias(): Observable<GeoRefProvinciasResponse> {
    return this.http.get<GeoRefProvinciasResponse>(
      `${this.apiUrl}/provincias?campos=id,nombre`
    );
  }

  getLocalidades(idProvincia: string): Observable<GeoRefLocalidadesResponse> {
    return this.http.get<GeoRefLocalidadesResponse>(
      `${this.apiUrl}/localidades?provincia=${idProvincia}&campos=id,nombre&max=1000` 
    );
  }
}
