import { Component, OnInit } from '@angular/core';
import { EventoAstronomico } from '../../models/eventoAstronomico';
import { EventosAstronomicosService } from '../../services/eventosAstronomicosService';
import { EventoAstronomicoComponente } from "../../components/evento-astronomico/evento-astronomico";
import { FormsModule } from '@angular/forms';
import { FadeUp } from '../../animaciones/fade-up/fade-up';

@Component({
  selector: 'app-articulos-astronomicos',
  imports: [EventoAstronomicoComponente, FormsModule, FadeUp],
  templateUrl: './eventos-astronomicos.html',
  styleUrl: './eventos-astronomicos.css',
})
export class EventosAstronomicos implements OnInit {
  listadoEventos: any[] = [];
  listadoEventosFiltrados: any[] = [];

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

        const tiposDeEventos = this.listadoEventos
        .map(evento => evento.tipo_evento)
        .filter(tipo => tipo );
                                                  

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
      const fechaEvento = new Date(evento.fecha_inicio + 'T00:00:00');
      return fechaEvento >= hoy;
    })
    .sort((a, b) => new Date(a.fecha_inicio).getTime() - new Date(b.fecha_inicio).getTime());

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
      const fechaEvento = new Date(evento.fecha_inicio + 'T00:00:00');
      return fechaEvento >= hoy;
    });

    this.ordenarListado();
  }

  ordenarListado() {
    this.listadoEventosFiltrados.sort((a, b) => {
      const fechaA = new Date(a.fecha_inicio).getTime();
      const fechaB = new Date(b.fecha_inicio).getTime();
      return this.ordenAscendente ? fechaA - fechaB : fechaB - fechaA;
    });
  }

  aplicarFiltro() {

    let inicio: number;
    let fin: number;

    if (!this.fechaInicioFiltro && !this.fechaFinFiltro) {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        inicio = hoy.getTime();
        fin = 9999999999999; // Futuro lejano
    } else {
        // Si el usuario puso fechas, usamos ese rango (aunque sea en el pasado)
        inicio = this.fechaInicioFiltro ? new Date(this.fechaInicioFiltro + 'T00:00:00').getTime() : 0;
        fin = this.fechaFinFiltro ? new Date(this.fechaFinFiltro + 'T23:59:59').getTime() : 9999999999999;
    }

     const filtrarPorTipo = this.tiposSeleccionados.size > 0;



    this.listadoEventosFiltrados = this.listadoEventos.filter(evento => {
      const fechaEvento = new Date(evento.fecha_inicio + 'T00:00:00').getTime();
      const dentroRangoFechas = fechaEvento >= inicio && fechaEvento <= fin;

      const coincideTipo = !filtrarPorTipo || this.tiposSeleccionados.has(evento.tipo_evento);
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
