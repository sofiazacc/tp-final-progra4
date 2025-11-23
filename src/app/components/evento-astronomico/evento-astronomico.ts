import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-evento-astronomico',
  imports: [RouterLink, DatePipe],
  templateUrl: './evento-astronomico.html',
  styleUrl: './evento-astronomico.css',
})
export class EventoAstronomicoComponente {
  @Input() evento: any;

  generarLinkACalendar(): string {
    const titulo = encodeURIComponent(this.evento.nombre);
    const descripcion = encodeURIComponent(this.evento.descripcion);
  
    const fechaInicio = this.evento.fecha_inicio || this.evento.fechaInicio;
    const fechaFin = this.evento.fecha_fin || this.evento.fechaFin;
  
    const inicio = new Date(fechaInicio).toISOString().replace(/-|:|\.\d{3}/g, '');
    const fin = new Date(fechaFin).toISOString().replace(/-|:|\.\d{3}/g, '');
  
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${titulo}&details=${descripcion}&dates=${inicio}/${fin}`;
  }
  
  comprobarSiEsEventoActual(): boolean {
    const ahora = new Date();
    const inicio = new Date(this.evento.fechaInicio);
    const fin = new Date(this.evento.fechaFin);
    return ahora >= inicio && ahora <= fin;
  }
}
