import { Component, Input } from '@angular/core';
import { PostModelo } from '../../models/post';

@Component({
  selector: 'app-pop-up-mapa',
  imports: [],
  templateUrl: './pop-up-mapa.html',
  styleUrl: './pop-up-mapa.css',
})
export class PopUpMapa {
  // Recibimos la lista de posts desde el mapa
  @Input() posts: PostModelo[] = []; 

  // Variable para saber la foto actual 
  indiceActual: number = 0;

  get postActual(): PostModelo {
    return this.posts[this.indiceActual];
  }

  // Avanzar a la siguiente foto
  siguiente() {
    if (this.indiceActual < this.posts.length - 1) {
      this.indiceActual++;
    } else {
      this.indiceActual = 0; 
    }
  }

  // Volver a la foto anterior
  anterior() {
    if (this.indiceActual > 0) {
      this.indiceActual--;
    } else {
      this.indiceActual = this.posts.length - 1; 
    }
  }
}

