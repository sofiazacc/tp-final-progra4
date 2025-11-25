import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, NgZone, PLATFORM_ID, ViewChild } from '@angular/core';

// clase de la estrella
class Particula {
  angulo: number;
  distancia: number;
  tamano: number;
  opacidad: number;
  velocidadOrbita: number;
  
  constructor(anchoCanvas: number, altoCanvas: number) {
    this.angulo = Math.random() * Math.PI * 2;
    
    // calculamos distancia para llenar la pantalla
    const distanciaMaxima = Math.max(anchoCanvas, altoCanvas) / 1.2; 
    this.distancia = Math.random() * distanciaMaxima + 20;
    
    this.tamano = Math.random() * 2 + 0.5;
    this.opacidad = Math.random() * 0.8 + 0.2;
    this.velocidadOrbita = Math.random() * 0.001 + 0.0003;
  }

  // actualiza solo el giro, sin cambiar la distancia (SIN ZOOM)
  actualizar(centroX: number, centroY: number) {
    // giro constante
    this.angulo += this.velocidadOrbita;

    // posicion simple: centro dinamico + orbita fija
    const x = centroX + Math.cos(this.angulo) * this.distancia;
    const y = centroY + Math.sin(this.angulo) * this.distancia;

    return { x, y, tamano: this.tamano, opacidad: this.opacidad };
  }

  dibujar(contexto: CanvasRenderingContext2D, pos: any) {
    contexto.fillStyle = `rgba(0, 0, 0, ${pos.opacidad})`;
    contexto.beginPath();
    contexto.arc(pos.x, pos.y, pos.tamano, 0, Math.PI * 2);
    contexto.fill();
    
    contexto.strokeStyle = `rgba(0, 0, 0, ${pos.opacidad * 0.2})`;
    contexto.lineWidth = 0.5;
    contexto.beginPath();
    contexto.arc(pos.x, pos.y, pos.tamano + 2, 0, Math.PI * 2);
    contexto.stroke();
  }
}
@Component({
  selector: 'app-fondo-galaxia',
  imports: [],
  templateUrl: './fondo-galaxia.html',
  styleUrl: './fondo-galaxia.css',
})
export class FondoGalaxia {

 @ViewChild('galaxyCanvas') referenciaCanvas!: ElementRef<HTMLCanvasElement>;
  
  private contexto!: CanvasRenderingContext2D;
  private particulas: Particula[] = [];
  private idAnimacion: number | null = null;
  
  private ancho = 0;
  private alto = 0;
  
  // movimiento del mouse
  private mouseX = 0;
  private mouseY = 0;

  // posicion de la galaxia
  private galaxiaX = 0;
  private galaxiaY = 0;

  private escuchadorRedimension = () => this.redimensionarCanvas();
  private escuchadorMouse = (e: MouseEvent) => this.actualizarMouse(e);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.inicializarCanvas();
    }
  }

  ngOnDestroy(): void {
    if (this.idAnimacion) cancelAnimationFrame(this.idAnimacion);
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.escuchadorRedimension);
      window.removeEventListener('mousemove', this.escuchadorMouse);
    }
  }

  private inicializarCanvas() {
    const canvas = this.referenciaCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    this.contexto = ctx;
    
    this.redimensionarCanvas();
    
    // centro inicial
    this.galaxiaX = this.ancho / 2;
    this.galaxiaY = this.alto / 2;
    this.mouseX = this.galaxiaX;
    this.mouseY = this.galaxiaY;

    window.addEventListener('resize', this.escuchadorRedimension);
    window.addEventListener('mousemove', this.escuchadorMouse);
    
    this.crearParticulas(1200);

    this.ngZone.runOutsideAngular(() => this.animar());
  }

  private crearParticulas(cantidad: number) {
    this.particulas = [];
    for (let i = 0; i < cantidad; i++) {
      this.particulas.push(new Particula(this.ancho, this.alto));
    }
  }

  private redimensionarCanvas() {
    if (!this.referenciaCanvas) return;
    const canvas = this.referenciaCanvas.nativeElement;
    this.ancho = window.innerWidth;
    this.alto = window.innerHeight;
    canvas.width = this.ancho;
    canvas.height = this.alto;
  }

  private actualizarMouse(e: MouseEvent) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  }

  private animar() {
    this.contexto.fillStyle = '#ffffff';
    this.contexto.fillRect(0, 0, this.ancho, this.alto);

    // SEGUIMIENTO SIMPLE: la galaxia se mueve hacia el mouse
    // 0.10 es la velocidad de reaccion (ajusta si lo quieres mas rapido/lento)
    this.galaxiaX += (this.mouseX - this.galaxiaX) * 0.002;
    this.galaxiaY += (this.mouseY - this.galaxiaY) * 0.002;

    // dibujar sin calcular tension ni zoom
    this.particulas.forEach((particula) => {
      const pos = particula.actualizar(this.galaxiaX, this.galaxiaY);
      particula.dibujar(this.contexto, pos);
    });

    this.idAnimacion = requestAnimationFrame(() => this.animar());
  }
}