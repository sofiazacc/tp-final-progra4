import { Component, OnInit } from '@angular/core';
import { EventoAstronomico } from '../../models/eventoAstronomico';
import { EventosAstronomicosService } from '../../services/eventosAstronomicosService';
import { EventoAstronomicoComponente } from "../../components/evento-astronomico/evento-astronomico";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-articulos-astronomicos',
  imports: [EventoAstronomicoComponente, FormsModule],
  templateUrl: './eventos-astronomicos.html',
  styleUrl: './eventos-astronomicos.css',
})
export class EventosAstronomicos implements OnInit {
  listadoEventos: EventoAstronomico[] = [];
  listadoEventosFiltrados: EventoAstronomico[] = [];

  mostrarFiltroFechas: boolean = false;
  mostrarFiltroTipos: boolean = false;
  mostrarOrden: boolean = false;
  fechaInicioFiltro: string = '';
  fechaFinFiltro: string = '';

  minFecha: string = '2025-01-01';
  maxFecha: string = '2030-12-31';

  tiposDeEventos: string[] = [];
  tiposDeEventosSinDuplicados: string[] = [];
  tiposSeleccionados: Set<string> = new Set();

  ordenAscendente: boolean = true;

  constructor(private eventosService: EventosAstronomicosService) {}

  ngOnInit(): void {
    this.cargarEventos();
  }

  cargarEventos() {
    // Lógica para cargar los eventos astronómicos
    this.eventosService.getEventosAstronomicos().subscribe({
      next: (datos) => {
        this.listadoEventos = datos as EventoAstronomico[];

        const tiposDeEventos = this.listadoEventos.map(evento => evento.tipoEvento);
        this.tiposDeEventosSinDuplicados = [...new Set(tiposDeEventos)];

        this.filtrarEventosFuturos();
      },
      error: (error) => {
        console.error('Error al cargar los eventos astronómicos:', error);
      }
    });
  }


  filtrarEventosFuturos() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Establecer la hora a medianoche para comparar solo fechas

    this.listadoEventosFiltrados = this.listadoEventos.filter(evento => {
      const fechaEvento = new Date(evento.fechaInicio + 'T00:00:00');
      return fechaEvento >= hoy;
    })
    .sort((a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime());

  }

  siNoFechas(){
    this.mostrarFiltroFechas = !this.mostrarFiltroFechas;
  }

  siNoTipos(){
    this.mostrarFiltroTipos = !this.mostrarFiltroTipos;
  }

  siNoOrden(){
    this.mostrarOrden = !this.mostrarOrden;
  }

  seleccionarTipo(tipo: string) {
    if(this.tiposSeleccionados.has(tipo)){
      this.tiposSeleccionados.delete(tipo);
    } else {
      this.tiposSeleccionados.add(tipo);
    }
    this.aplicarFiltro();
  }

  cambiarOrden(ascendente: boolean) {
    this.ordenAscendente = ascendente;
    this.aplicarFiltro();
  }

  filtrarEventosFuturosPorFechas() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Establecer la hora a medianoche para comparar solo fechas
    this.fechaInicioFiltro = "";
    this.fechaFinFiltro = "";

    this.listadoEventosFiltrados = this.listadoEventos.filter(evento => {
      const fechaEvento = new Date(evento.fechaInicio + 'T00:00:00');
      return fechaEvento >= hoy;
    });

    this.ordenarListado();
  }

  ordenarListado() {
    this.listadoEventosFiltrados.sort((a, b) => {
      const fechaA = new Date(a.fechaInicio).getTime();
      const fechaB = new Date(b.fechaInicio).getTime();
      return this.ordenAscendente ? fechaA - fechaB : fechaB - fechaA;
    });
  }

  aplicarFiltro() {
    const inicio = this.fechaInicioFiltro ? new Date(this.fechaInicioFiltro + 'T00:00:00').getTime() : 0;
    const fin = this.fechaFinFiltro ? new Date(this.fechaFinFiltro + 'T23:59:59').getTime() : 9999999999999;

    const filtrarPorTipo = this.tiposSeleccionados.size > 0;

    this.listadoEventosFiltrados = this.listadoEventos.filter(evento => {
      const fechaEvento = new Date(evento.fechaInicio + 'T00:00:00').getTime();
      const dentroRangoFechas = fechaEvento >= inicio && fechaEvento <= fin;

      const coincideTipo = filtrarPorTipo || this.tiposSeleccionados.has(evento.tipoEvento);
      return dentroRangoFechas && coincideTipo;
    });

    this.ordenarListado();
  }

  limpiarFiltros() {
    this.fechaInicioFiltro = '';
    this.fechaFinFiltro = '';
    this.tiposSeleccionados.clear();
    this.ordenAscendente = true;
    this.filtrarEventosFuturos();
  }
}
