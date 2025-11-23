import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EventosAstronomicosService {
  private eventos = "http://localhost:3000/eventosAstronomicos";

  constructor(private http: HttpClient) {}

  getEventosAstronomicos() {
    return this.http.get(this.eventos);
  }

  getEventoAstronomicoPorId(id: number) {
    return this.http.get(`${this.eventos}/${id}`);
  }
}
