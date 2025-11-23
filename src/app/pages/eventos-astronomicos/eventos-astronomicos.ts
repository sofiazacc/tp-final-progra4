import { Component } from '@angular/core';
import { EventoAstronomico } from '../../models/eventoAstronomico';
import { EventosAstronomicosService } from '../../services/eventosAstronomicosService';

@Component({
  selector: 'app-articulos-astronomicos',
  imports: [],
  templateUrl: './eventos-astronomicos.html',
  styleUrl: './eventos-astronomicos.css',
})
export class ArticulosAstronomicos implements OnInit {
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
