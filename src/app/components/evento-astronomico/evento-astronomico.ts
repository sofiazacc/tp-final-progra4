import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-evento-astronomico',
  imports: [DatePipe],
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
  
    const inicio = new Date(fechaInicio + 'T03:00:00Z').toISOString().replace(/-|:|\.\d{3}/g, '');
    const fin = new Date(fechaFin + 'T03:00:00Z' ).toISOString().replace(/-|:|\.\d{3}/g, '');
  
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${titulo}&details=${descripcion}&dates=${inicio}/${fin}`;
  }

  mostrarBotonAgendar(): boolean {
    const fechaActual = new Date();
    const fechaInicio = new Date(this.evento.fecha_inicio || this.evento.fechaInicio);
    return fechaActual < fechaInicio;
  }

  abrirCalendar(): void {
  window.open(this.generarLinkACalendar(), '_blank');
  }
}
