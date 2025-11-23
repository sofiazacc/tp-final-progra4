import { Component, OnInit } from '@angular/core';
import { EventoAstronomico } from '../../models/eventoAstronomico';
import { EventosAstronomicosService } from '../../services/eventosAstronomicosService';
import { EventoAstronomicoComponente } from "../../components/evento-astronomico/evento-astronomico";

@Component({
  selector: 'app-articulos-astronomicos',
  imports: [EventoAstronomicoComponente],
  templateUrl: './eventos-astronomicos.html',
  styleUrl: './eventos-astronomicos.css',
})
export class EventosAstronomicos implements OnInit {
  listadoEventos: EventoAstronomico[] = [];

  constructor(private eventosService: EventosAstronomicosService) {}

  ngOnInit(): void {
    this.cargarEventos();
  }

  cargarEventos() {
    // Lógica para cargar los eventos astronómicos
    this.eventosService.getEventosAstronomicos().subscribe({
      next: (datos) => {
        this.listadoEventos = datos as EventoAstronomico[];
      },
      error: (error) => {
        console.error('Error al cargar los eventos astronómicos:', error);
      }
    });
  }
}
