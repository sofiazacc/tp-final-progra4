import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PostModelo } from '../../models/post';
import { FavoritosService } from '../../services/marcadoresFavoritosService';

@Component({
  selector: 'app-pop-up-mapa',
  imports: [],
  templateUrl: './pop-up-mapa.html',
  styleUrl: './pop-up-mapa.css',
})
export class PopUpMapa implements OnInit{

  constructor(private favoritoService: FavoritosService) {}

  // Recibimos la lista de posts desde el mapa
  @Input() posts: PostModelo[] = []; 

  // Recibimos el ID del marcador actual
  @Input() marcadorId: string | null = null;

  // Variable para saber la foto actual 
  indiceActual: number = 0;
  imagenCargando: boolean = false;
  esFavorito: boolean = false;

  ngOnInit(): void {
    // Verificamos si el marcador es favorito
    if(this.marcadorId){
      this.esFavorito = this.favoritoService.esFavorito(this.marcadorId);
    }
  }

  //Vamos a obtener el título del lugar usando la API de Maps
  @Input() tituloLugar: string = '';

  get postActual(): PostModelo {
    return this.posts[this.indiceActual];
  }


  get puedoIrAdelante(): boolean {
    return this.posts.length > 1;
  }

  get puedoIrAtras(): boolean {
    return this.posts.length > 1;
  }

  // Avanzar a la siguiente foto
  siguiente() {
    if (this.indiceActual < this.posts.length - 1) {
      this.indiceActual++;
    } else {
      this.indiceActual = 0; 
    }

     if(this.marcadorId){
    this.esFavorito = this.favoritoService.esFavorito(this.marcadorId);
    }
  }

  // Volver a la foto anterior
  anterior() {
    if (this.indiceActual > 0) {
      this.indiceActual--;
    } else {
      this.indiceActual = this.posts.length - 1; 
    }

     if(this.marcadorId){
    this.esFavorito = this.favoritoService.esFavorito(this.marcadorId);
    }
  }
  
  onImagenCargada() {
  // Cuando carga, agrega la clase
  const img = document.querySelector('.foto-real') as HTMLImageElement;
  if (img) {
    img.classList.add('loaded');
  }
}

  //LE vamaos a emitir a mapa la señal para ejecutar el método  cerrarPopup()  al cerrar el pop-up
  @Output() close = new EventEmitter<void>();

  cerrar() {
     this.close.emit();
   }

  //Marcar o desmarcar como favorito
  marcarDesmarcarComoFavorito() {
    if(this.marcadorId){
      this.favoritoService.marcarDesmarcarComoFavorito(this.marcadorId).subscribe({
       //Actualizamos el estado del favorito
        next: () => {
          this.esFavorito = !this.esFavorito;

          window.dispatchEvent(new CustomEvent('favoritoActualizado'));
        },
        error: (e) => console.log(e)
      });
    }   
}
}
